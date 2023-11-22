import winston, { format, transports } from "winston";

const logger = winston.createLogger({
    transports: [
        new transports.Console(),
        new transports.File({
            filename: "logs/logs.log",
        }),
    ],
    format: format.combine(
        format.timestamp(),
        format.printf((info: any) => `[${info.level}] [${info.timestamp}]: ${info.message}`) 
    ),
});

export default logger;