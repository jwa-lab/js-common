"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLogger = void 0;
const loggerAbstract_1 = require("./loggerAbstract");
class WinstonLogger extends loggerAbstract_1.GenercicLogger {
    constructor(serviceName, logger) {
        super();
        this.serviceName = serviceName;
        this.logger = logger;
    }
    log(level, message) {
        this.logger.log({
            level,
            logInfos: {
                service: this.serviceName,
                date: new Date()
            },
            message
        });
    }
}
exports.WinstonLogger = WinstonLogger;
