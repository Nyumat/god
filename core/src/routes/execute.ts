import containerPools from 'Docker/pool.ts';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const code = req.body.code;

    const tmpPath = path.resolve(__dirname, '..', 'tmp');
    const filename = 'main.py';
    const filePath = path.resolve(tmpPath, filename);

    addFile(filePath, code);
});

const addFile = (filePath: string, content: string) => {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}



export default router;
