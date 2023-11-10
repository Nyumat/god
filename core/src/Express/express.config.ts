import compression from "compression"
import cookieParser from "cookie-parser"

import express, { Application } from "express"
import helmet from "helmet"
import morgan from "morgan"

const ExpressConfig = (): Application => {
    const app = express()
    app.use(compression())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    app.use(helmet())
    app.use(cookieParser())
    app.use(morgan("dev"))

    return app
}

export default ExpressConfig