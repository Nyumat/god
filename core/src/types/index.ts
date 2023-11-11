export type ContainerType = {
    collectionId: string;
    collectionName: string;
    containerId: string;
    created: string;
    id: string;
    language: string;
    metadata: {
        modem: {
            protocol: string;
        };
        id: string;
        defaultOptions: {
            [key: string]: any;
        };
    };
    running: boolean;
    updated: string;
};