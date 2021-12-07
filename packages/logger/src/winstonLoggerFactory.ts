import * as winston from "winston";
import { WinstonLogger } from "./WinstonLogger";
import newrelicFormatter from "@newrelic/winston-enricher"

export function makeWinstonLogger(loggingFormat: string, loggingLevel = "info", newrelic = false): WinstonLogger {

    loggingFormat = loggingFormat.toLocaleLowerCase();
    if (loggingFormat !== "cli" && loggingFormat !== "json") {
        // TODO: create specific error
        throw new Error(`Invalid logging format given: "${loggingFormat}", only "cli" and "json" allowed`);
    }

    loggingLevel = loggingLevel.toLocaleLowerCase();
    const availableLevels = Object.keys(winston.config.syslog.levels);
    if (availableLevels.indexOf(loggingLevel) === -1) {
        // TODO: create specific error
        throw new Error(`Invalid logging level given: "${loggingLevel}", allowed values: "${availableLevels.join('", "')}"`);
    }

    const formats = [winston.format.timestamp()];

    if (loggingFormat.toLocaleLowerCase() === "cli") {
        formats.push(winston.format.padLevels({levels: winston.config.syslog.levels}));
        formats.push(winston.format.colorize({colors: {emerg: "red", alert: "red", crit: "red", error: "red", warning: "yellow", notice: "yellow", info: "blue", debug: "blue"} }));
        formats.push(winston.format.printf((info) => { return `[${info.timestamp}] ${info.level}:${info.message}`}))
    } else {
        formats.push(winston.format.json())
    }

    if (newrelic && loggingFormat !== "cli") {
        formats.push(newrelicFormatter());
    }

    const logger = winston.createLogger({
        level: loggingLevel,
        levels: winston.config.syslog.levels,
        transports: [new winston.transports.Console({format: winston.format.combine(...formats)})]
    });

    return new WinstonLogger(logger);
}
