import morgan from "morgan";
import logger from "./logger";
import { Request, Response } from "express";

const format = ":method :url HTTP/:http-version :status :response-time ms :res[content-length]";

const errorHandler = morgan(format, {
    skip: (_req: Request, res: Response) => res.statusCode < 400,
    stream: {
        write: (message: string) => logger.error(message.trim())
    }
})

const succesHandler = morgan(format, {
    skip: (_req: Request, res: Response) => res.statusCode >= 400,
    stream: {
        write: (message: string) => logger.info(message.trim())
    }
})

export default { errorHandler, succesHandler }