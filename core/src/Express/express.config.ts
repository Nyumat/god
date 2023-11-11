import compression from "compression"
import cookieParser from "cookie-parser"

import express, { Application } from "express"
import helmet from "helmet"
import morgan from "morgan"

import EXECUTE_ROUTER from "../routes/execute.ts"

const ExpressConfig = (): Application => {
    const app = express()
    app.use(compression())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use(helmet())
    app.use(cookieParser())
    app.use(morgan("dev"))

    app.use("/submission", EXECUTE_ROUTER)

    return app
}

export default ExpressConfig