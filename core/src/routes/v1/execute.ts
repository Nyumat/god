import docker from 'Docker/docker.ts';
import { getContainers } from 'Docker/pool.ts';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import { getCommand, getFilePath, getStreamOutput } from 'routes/lib/index.ts';
import { golangHandler, nodeHandler, pythonHandler } from './handlers.ts';

const router = Router();

router.post('/v1/execute', async (req: Request, res: Response) => {
    const code = req.body.code;
    const language = req.body.language;
    let output;

    if (!code) {
        return res.status(400).json({ message: 'No code provided' });
    }

    if (!language) {
        return res.status(400).json({ message: 'No language provided' });
    }

    switch (language) {
        case 'python':
            output = await pythonHandler(code);
            break;
        case 'node':
            output = await nodeHandler(code);
            break;
        case 'golang':
            output = await golangHandler(code);
            break;
        default:
            return res.status(400).json({ message: 'Invalid language provided' });
    }

    return res.status(200).json({ language, code, output });

});

export const addFile = (filePath: string, content: string) => {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}

export const runCode = async (filePath: string, language: string, timeoutInSeconds: number, memoryLimitInMB: number) => {
    const containers = await getContainers();

    const containerIndex = containers.findIndex(container => container.language === language);

    if (containerIndex === -1) {
        throw new Error(`No container found for language ${language}`);
    }

    const containerId = containers[containerIndex].containerId

    const container = docker.getContainer(containerId);

    const isGo = language === 'golang';

    const goCommand = isGo ? `go run ${getFilePath(language)}` : '';

    const exec = await container.exec({
        Cmd: isGo ? ['sh', '-c', goCommand] : [getCommand(language), getFilePath(language)],
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: true,
        Tty: true,
    });

    const stream = await exec.start({
        Detach: false,
        Tty: true,
    });

    const timeout = setTimeout(() => {
        stream.destroy();
    }, timeoutInSeconds * 1000);

    const output = await getStreamOutput(stream);

    clearTimeout(timeout);

    return output;
}

export default router;