
import { LANGUAGES, PASSWORD, POCKETBASE_URL, USERNAME } from 'constants.ts';
import { Container, ContainerInfo } from 'dockerode';
import PocketBase from 'pocketbase';
import logger from "../Logger/index.ts";
import { ContainerType } from '../types/index.ts';
import docker from "./docker.ts";

const pb = new PocketBase(POCKETBASE_URL)

await pb.admins.authWithPassword(USERNAME, PASSWORD)

pb.autoCancellation(false)

async function initializeContainerPools() {
    if ((await docker.listContainers()).length < 3 && (await pb.collection("containers").getFullList()).length < 3) {
        try {
            logger.info('\n ⚡️ Initializing container pools... ⚡️ \n');

            let created = 0;

            const containers = await getContainers();

            for (const language of LANGUAGES) {
                const existingContainers = containers.filter(container => container.language === language)

                if (existingContainers.length > 0) {
                    logger.info(`\n ✅ Container with language ${language} already exist. Skipping creation. \n`);
                    continue;
                }

                await createInitializedContainer(language);
                created += 1;
                logger.info(`\n ✅ Created container with language ${language} \n`);
            }

            logger.success(`\n 🚀 Created ${created} Containers \n`);
        } catch (error) {
            logger.error(`Error initializing container pools: ${error}`);

            const containers = await getContainers();

            const existingLanguages = containers.map(container => container.language);

            const missingLanguages = LANGUAGES.filter(language => !existingLanguages.includes(language));

            for (const language of missingLanguages) {
                await createInitializedContainer(language);
                logger.info(`\n ✅ Created container with language ${language} because it was missing \n`);
            }

            logger.success(`\n 🚀 Created ${missingLanguages.length} Containers \n`);
        }
    }

}

async function createInitializedContainer(language: string) {
    const container = await docker.createContainer({
        Image: language === 'golang' ? 'golang:1.19' : `${language}:latest`,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: true,
        StdinOnce: false,
        StopTimeout: 5,
        HostConfig: {
            AutoRemove: true,
            Binds: [
                `${process.cwd()}/src/tmp:/tmp`,
                ...(language === 'golang' ? [`${process.cwd()}/src/tmp:/go/src/app`] : [])
            ],
        },
    });

    await container.start();

    container.exec({
        Cmd: ['mkdir', '-p', '/tmp'],
        AttachStdout: true,
        AttachStderr: true,
    }, (err, exec) => {
        if (err) {
            console.error(err);
            return;
        }

        exec?.start({ Detach: false, Tty: false }, (err, stream) => {
            if (err) {
                console.error(err);
                return;
            }

            container.exec({
                Cmd: ['chmod', '-R', '777', '/tmp'],
                AttachStdout: true,
                AttachStderr: true,
            }, (err, exec) => {
                if (err) {
                    console.error(err);
                    return;
                }

                exec?.start({ Detach: false, Tty: false }, (err, stream) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            });
        })


    });

    const data = {
        language,
        containerId: container.id,
        metadata: JSON.stringify(container),
        running: true
    };

    const record = await pb.collection('containers').create(data);

    return record;
}

async function cleanupContainerPools() {
    // Get all containers from Docker and PocketBase
    const dockerContainers = await docker.listContainers() as ContainerInfo[];
    const dbContainers = await pb.collection('containers').getFullList() as ContainerType[];

    // Create an array of promises for cleanup tasks
    const cleanupTasks: Promise<void>[] = [];

    // Cleanup Docker containers
    cleanupTasks.push(...dockerContainers.map(cleanupContainerDocker));

    // Cleanup database containers
    cleanupTasks.push(...dbContainers.map(cleanupContainerDB));

    // Wait for all cleanup tasks to complete
    await Promise.all(cleanupTasks);

    logger.success('\n 🚀 Cleaned up container pools. Goodbye! \n');
}

async function cleanupContainerDocker(container: ContainerInfo) {
    const containerInstance = docker.getContainer(container.Id) as Container;
    containerInstance.stop();
    containerInstance.remove();
    logger.info(`\n 👋🏿 ${container.Image} container stopped & removed from Docker. \n`);
}

async function cleanupContainerDB(container: ContainerType) {
    try {
        await pb.collection('containers').delete(container.id);
        logger.info(`\n 👋🏿 ${container.language} container records removed from PocketBase. \n`);
    } catch (error) {
        logger.error(`Error cleaning up container from PocketBase: ${error}`);
    }
}

process.on('SIGINT', async () => {
    await cleanupContainerPools();
    process.exit();
});

process.on('SIGTERM', async () => {
    await cleanupContainerPools();
    process.exit();
});

process.on('exit', async () => {
    await cleanupContainerPools();
    process.exit();
});

const getContainers = async () => {
    const records = await pb.collection('containers').getFullList({
        sort: '-created'
    });

    const containers = await docker.listContainers();

    for (const record of records) {
        const containerExists = containers.some(container => container.Id === record.containerId);

        if (!containerExists) {
            await pb.collection('containers').delete(record.id);
        }
    }

    for (const container of containers) {
        const containerExists = records.some(record => record.containerId === container.Id);

        if (!containerExists) {
            const containerInstance = docker.getContainer(container.Id);

            await containerInstance.stop();
            await containerInstance.remove();
        }
    }

    const containerIds = containers.map(container => container.Id);

    const filteredRecords = records.filter(record => containerIds.includes(record.containerId));

    return filteredRecords;
}

export { initializeContainerPools, getContainers };