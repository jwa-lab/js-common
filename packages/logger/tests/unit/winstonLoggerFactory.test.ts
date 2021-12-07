import {WinstonLogger} from "../../src/WinstonLogger";


describe("logging format", () => {
    it("throws an exception if logging format is invalid", async () => {
        process.env = Object.assign(process.env, {
            NEW_RELIC_ENABLED: false,
            NEW_RELIC_NO_CONFIG_FILE: true,
        });

        const { makeWinstonLogger } = await import('../../src/winstonLoggerFactory');

        expect(() => {
            makeWinstonLogger("toto", "toto", false)
        }).toThrow("Invalid logging format");
    });
});

describe("logging level", () => {
    it("throws an exception if logging level is invalid", async () => {
        process.env = Object.assign(process.env, {
            NEW_RELIC_ENABLED: false,
            NEW_RELIC_NO_CONFIG_FILE: true,
        });

        const { makeWinstonLogger } = await import('../../src/winstonLoggerFactory');
        expect(() => {
            makeWinstonLogger("json", "toto", false)
        }) .toThrow("Invalid logging level");
    });
});

describe("returns a logger instance", () => {
    it("returns a logger instance", async () => {
        process.env = Object.assign(process.env, {
            NEW_RELIC_ENABLED: false,
            NEW_RELIC_NO_CONFIG_FILE: true,
        });

        const { makeWinstonLogger } = await import('../../src/winstonLoggerFactory');

        const logger = makeWinstonLogger("json", "debug", false);
        expect(logger).toBeInstanceOf(WinstonLogger);
    });
});
