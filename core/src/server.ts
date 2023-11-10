import dotenv from "dotenv"
import path from "path"
import ExpressConfig from "./Express/express.config"

const CONFIG_PATH = path.resolve(__dirname, '../config', '.env.local')

dotenv.config({ path: CONFIG_PATH })

const app = ExpressConfig()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log("Server Running on Port " + PORT))