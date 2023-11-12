import logger from "Logger/index.ts";
import fs from 'fs';
import path, { dirname } from "path";
import { addFile, runCode } from "./execute.ts";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const pythonHandler = async (code: string) => {
    const filePath = path.resolve(__dirname, '../../tmp', 'submission.py');
    addFile(filePath, code);
    try {
        const output = await runCode(filePath, 'python', 3, 128);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        return output;
    } catch (error) {
        logger.error(error as string);
        return error;

    }
}

export const nodeHandler = async (code: string) => {
    const filePath = path.resolve(__dirname, '../../tmp', 'submission.js');
    addFile(filePath, code);
    try {
        const output = await runCode(filePath, 'node', 3, 128);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        return output;
    } catch (error) {
        logger.error(error as string);
        return error;
    }
}


export const golangHandler = async (code: string) => {
    const filePath = path.resolve(__dirname, '../../tmp', 'main.go');
    addFile(filePath, code);
    try {
        const output = await runCode(filePath, 'golang', 3, 128);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        return output;
    } catch (error) {
        logger.error(error as string);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        return error;
    }
}

