import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG_PATH = path.resolve(__dirname, '../config', '.env.local')

dotenv.config({ path: CONFIG_PATH })

export const LANGUAGES = ['python', 'node', 'golang'];
export const POCKETBASE_URL = process.env.POCKETBASE_URL;
export const USERNAME = process.env.USERNAME as string;
export const PASSWORD = process.env.PASSWORD as string;
export const PORT = process.env.PORT || 3000;

export const PYTHON_FILE_PATH = '/tmp/submission.py';
export const NODE_FILE_PATH = '/tmp/submission.js';
export const GOLANG_FILE_PATH = '/go/src/app/main.go';

