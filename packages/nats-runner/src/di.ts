module.exports = {
    services: {
        GetDocsHandler: {
            class: "openApi",
            main: "GetDocsHandler",
            tags: [{ name: "nats.handler" }],
            arguments: ["%cwd%", "%config.SERVICE_NAME%", "@logger"]
        },
        winstonLogger: {
            class: "@jwalab/logger",
            main: "makeWinstonLogger",
            arguments: ["%config.LOGGING_FORMAT%", "%env(LOGGING_LEVEL)%", "%env(NEW_RELIC_ENABLED)%"]
        },
        logger: "@winstonLogger"
    }
};
