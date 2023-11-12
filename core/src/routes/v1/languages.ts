import { getContainers } from 'Docker/pool.ts';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/v1/languages', async (req: Request, res: Response) => {
    try {
        const containers = await getContainers();
        const languages = containers.map(container => {
            return {
                name: container.language,
            }
        })
        return res.status(200).json(languages);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

export default router;