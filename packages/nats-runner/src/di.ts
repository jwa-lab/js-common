module.exports = {
    services: {
        GetDocsHandler: {
            class: "@jwalab/open-api",
            main: "GetDocsHandler",
            tags: [{ name: "nats.handler" }],
            arguments: ["%cwd%", "%config.SERVICE_NAME%", "@logger"]
        },
        winstonLogger: {
            class: "@jwalab/logger",
            main: "makeWinstonLogger",
            arguments: ["%config.LOGGING_FORMAT%", "%config.SERVICE_NAME%"]
        },
        logger: "@winstonLogger"
    }
};
