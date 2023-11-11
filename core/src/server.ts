import initializeContainerPools from "Docker/pool.ts";
import logger from "Logger/index.ts";
import { PORT } from "constants.ts";
import ExpressConfig from "./Express/express.config.ts";

const app = ExpressConfig()

app.listen(PORT, async () => {
    await initializeContainerPools().catch((err) => {
        console.error('❌ Error initializing container pools:', err);
        process.exit(1);
    }).then(() => {
        logger.success("\n 🚀 Successfully initialized container pools. \n")
    }).finally(() => {
        logger.info(`\n 🔋 Server started on port ${PORT} \n`)
    })
})