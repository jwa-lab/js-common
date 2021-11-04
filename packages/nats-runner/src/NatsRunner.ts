import { connect, NatsConnection, Subscription, JSONCodec, Codec, JetStreamClient, JetStreamSubscription } from "nats";
import { ContainerBuilder, JsFileLoader, Parameter } from "node-dependency-injection";
import { Logger } from "@jwalab/logger";
import { JetStreamConsumer } from "./Consumers";

import { AirlockHandler, PrivateHandler } from "./Handlers";
import { AirlockMessage, JetStreamMessage, Message } from "./Messages";

export * from "./Messages";
export * from "./Handlers";
export * from "./Consumers";
export * from "./Plugin";
export * from "./tokenParser";

export enum AIRLOCK_VERBS {
    "GET" = "GET",
    "POST" = "POST",
    "PUT" = "PUT",
    "PATCH" = "PATCH",
    "DELETE" = "DELETE"
}

export interface NatsRunnerConfig {
    NATS_URL: string;
    SERVICE_NAME: string;
}

export class NatsRunner {
    private readonly cwd;
    private readonly container;
    private readonly jsonCodec: Codec<unknown>;

    private natsConnection!: NatsConnection;
    private jetStreamClient!: JetStreamClient;
    protected logger!: Logger;
    private config!: Record<string, unknown>;

    constructor(cwd: string) {
        this.jsonCodec = JSONCodec();
        this.cwd = cwd;
        this.container = new ContainerBuilder();
    }

    async start(): Promise<void> {
        try {
            await this.getConfig();
            this.initContainer();
            await this.initNats();
            await this.startPlugins();
            await this.registerNatsHandlers();
            await this.registerJetStreamConsumers();

            this.registerSignalHandlers();
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    private async getConfig() {
        try {
            const config = await import(`${this.cwd}/config`);
            this.config = config.default;
        } catch (err) {
            this.logger.error(`Unable to load required config.ts file ${err}`);
            process.exit(1);
        }
    }

    private initContainer() {
        Object.keys(this.config).forEach((configName) => {
            this.config[configName] &&
                this.container.setParameter(`config.${configName}`, this.config[configName] as Parameter);
        });

        this.container.setParameter("cwd", this.cwd);
        const loader = new JsFileLoader(this.container);

        loader.load(`${__dirname}/di`);
        loader.load(`${this.cwd}/di`);

        this.logger = this.container.get<Logger>("logger");

        this.container.logger = { warn: (msg) => this.logger.warning(msg) };

        this.logger.debug("NatsRunner container initialized");
    }

    private async initNats() {
        this.natsConnection = await connect({
            servers: this.config.NATS_URL as string
        });

        this.container.register("natsConnection");
        this.container.set("natsConnection", this.natsConnection);

        this.jetStreamClient = this.natsConnection.jetstream();

        this.container.register("jetStreamClient");
        this.container.set("jetStreamClient", this.jetStreamClient);

        this.logger.debug(`NatsRunner connected to NATS ${this.config.NATS_URL} and JetStream client initialized`);
    }

    private async startPlugins() {
        const ids = Array.from(this.container.findTaggedServiceIds("runner.plugin").keys());

        await Promise.all(
            ids.map(async (id) => {
                const plugin = this.container.get(id);

                await plugin.start();
            })
        );
    }

    private async registerNatsHandlers() {
        const ids = Array.from(this.container.findTaggedServiceIds("nats.handler").keys());

        ids.forEach((id) => {
            const handler = this.container.get(id);

            if (handler instanceof PrivateHandler) {
                this.registerPrivateHandler(handler);
            } else if (handler instanceof AirlockHandler) {
                this.registerAirlockHandler(handler);
            } else {
                throw new Error("Nats Handler must extend type Handler or AirlockHandler");
            }
        });
    }

    private async registerJetStreamConsumers() {
        const ids = Array.from(this.container.findTaggedServiceIds("nats.consumer").keys());

        ids.forEach((id) => {
            const consumer = this.container.get(id);

            if (consumer instanceof JetStreamConsumer) {
                this.registerJetStreamConsumer(consumer);
            } else {
                throw new Error("Nats Consumer must extend type JetStreamConsumer");
            }
        });
    }

    private registerPrivateHandler(handler: PrivateHandler) {
        let subject;

        if (handler.serviceScopedSubject) {
            subject = `${this.config.SERVICE_NAME}.${handler.subject}`;
        } else {
            subject = handler.subject;
        }

        this.logger.debug(`Registering private handler for ${subject}`);
        const subscriptionOptions = handler.getSubscriptionOptions();

        const subscription = this.natsConnection.subscribe(subject, subscriptionOptions);

        this.handlePrivateMessage(subscription, handler);
    }

    private registerAirlockHandler(handler: AirlockHandler) {
        const subject = `${handler.verb}:${this.config.SERVICE_NAME}.${handler.subject}`;
        this.logger.debug(`Registering airlock handler for ${subject}`);
        const subscriptionOptions = handler.getSubscriptionOptions();

        const subscription = this.natsConnection.subscribe(subject, subscriptionOptions);

        this.handleAirlockMessage(subscription, handler);
    }

    async handleAirlockMessage(subscription: Subscription, handler: AirlockHandler): Promise<void> {
        for await (const message of subscription) {
            try {
                const response = await handler.handle(new AirlockMessage(message));

                message.respond(this.jsonCodec.encode(response));
            } catch (err) {
                this.logger.error((err as Error).message);
                message.respond(
                    this.jsonCodec.encode({
                        error: (err as Error).message
                    })
                );
            }
        }
    }

    async handlePrivateMessage(subscription: Subscription, handler: PrivateHandler): Promise<void> {
        for await (const message of subscription) {
            try {
                const response = await handler.handle(new Message(message));

                message.respond(this.jsonCodec.encode(response));
            } catch (err) {
                this.logger.error((err as Error).message);
                message.respond(
                    this.jsonCodec.encode({
                        error: (err as Error).message
                    })
                );
            }
        }
    }

    private async registerJetStreamConsumer(consumer: JetStreamConsumer) {
        const subject = consumer.subject;

        this.logger.debug(`Registering consumer for ${subject}`);

        const consumerOptions = consumer.getConsumerOptions();

        const subscription = await this.jetStreamClient.subscribe(subject, consumerOptions);

        this.handleJetStreamMessage(subscription, consumer);
    }

    async handleJetStreamMessage(subscription: JetStreamSubscription, consumer: JetStreamConsumer): Promise<void> {
        for await (const message of subscription) {
            try {
                await consumer.handle(new JetStreamMessage(message));
            } catch (err) {
                this.logger.error((err as Error).message);

                // if the handler wants the message to be redelivered,
                // it needs to catch the error itself and implement the necessary retries.
                // by default, a non caught error will prevent the message from being redelivered
                message.term();
            }
        }
    }

    private registerSignalHandlers() {
        const onGracefulShutdown = async () => {
            this.logger.debug("NatsRunner gracefully shutting down...");
            await this.natsConnection.drain();
            this.logger.debug("natsConnection drained");
            process.exit(0);
        };

        process.on("SIGINT", onGracefulShutdown);
        process.on("SIGTERM", onGracefulShutdown);
    }
}
