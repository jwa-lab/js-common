import * as winston from "winston";
import { Logger } from "./Logger";

export class WinstonLogger implements Logger {
    logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    public emerg(message: string): void {
        this.log("emerg", message);
    }

    public alert(message: string): void {
        this.log("alert", message);
    }

    public crit(message: string): void {
        this.log("crit", message);
    }

    public error(message: string): void {
        this.log("error", message);
    }

    public warning(message: string): void {
        this.log("warning", message);
    }

    public notice(message: string): void {
        this.log("notice", message);
    }

    public info(message: string): void {
        this.log("info", message);
    }

    public debug(message: string): void {
        this.log("debug", message);
    }

    private log(level: string, message: string) {
        this.logger.log(level, message);
    }
}
