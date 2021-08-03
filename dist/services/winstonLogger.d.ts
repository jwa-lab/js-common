import * as winston from 'winston';
import { GenercicLogger } from "./loggerAbstract";
export declare class WinstonLogger extends GenercicLogger {
    serviceName: string;
    logger: winston.Logger;
    constructor(serviceName: string, logger: winston.Logger);
    protected log(level: string, message: string): void;
}
