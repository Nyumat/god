import compression from "compression"
import cookieParser from "cookie-parser"

import express, { Application } from "express"
import helmet from "helmet"
import morgan from "morgan"

import EXECUTE_ROUTER from "../routes/v1/execute.ts"
import LANGUAGES_ROUTER from "../routes/v1/languages.ts"

const ExpressConfig = (): Application => {
    const app = express()
    app.use(compression())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use(helmet())
    app.use(cookieParser())
    app.use(morgan("dev"))

    app.use("/api", EXECUTE_ROUTER)
    app.use("/api", LANGUAGES_ROUTER)

    return app
}

export default ExpressConfig