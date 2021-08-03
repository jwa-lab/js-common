"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenercicLogger = void 0;
class GenercicLogger {
    emerg(message) {
        this.log("emerg", message);
    }
    alert(message) {
        this.log("alert", message);
    }
    crit(message) {
        this.log("crit", message);
    }
    error(message) {
        this.log("error", message);
    }
    warning(message) {
        this.log("warning", message);
    }
    notice(message) {
        this.log("notice", message);
    }
    info(message) {
        this.log("info", message);
    }
    debug(message) {
        this.log("debug", message);
    }
}
exports.GenercicLogger = GenercicLogger;
