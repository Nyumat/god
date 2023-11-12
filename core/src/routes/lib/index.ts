import { GOLANG_FILE_PATH, NODE_FILE_PATH, PYTHON_FILE_PATH } from "constants.ts";
import { Duplex } from "stream";

const PYTHON = 'python';
const NODE = 'node';
const GOLANG = 'golang';

export const getCommand = (language: string) => {
    switch (language) {
        case 'python':
            return 'python';
        case 'node':
            return 'node';
        case 'golang':
            return 'go run main.go';
        default:
            throw new Error(`Invalid language ${language}`);
    }
}

export const getFilePath = (language: string) => {
    switch (language) {
        case 'python':
            return PYTHON_FILE_PATH;
        case 'node':
            return NODE_FILE_PATH;
        case 'golang':
            return GOLANG_FILE_PATH;
        default:
            throw new Error(`Invalid language ${language}`);
    }
}

export const getStreamOutput = async (stream: Duplex) => {
    return new Promise<string>((resolve, reject) => {
        let output = '';

        stream.on('data', (chunk: Buffer) => {
            output += chunk.toString();
        });

        stream.on('end', () => {
            const cleanedOutput = output.replace(/\r?\n|\r/g, '');
            resolve(cleanedOutput);
        });

        stream.on('error', (err: Error) => {
            reject(err);
        });
    });
};
