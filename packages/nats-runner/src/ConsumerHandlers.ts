import { Logger } from "@jwalab/logger";
import {
    ConsumerOpts,
    ConsumerOptsBuilder,
    JetStreamClient,
    JetStreamPullSubscription,
    JetStreamSubscription,
    PullOptions
} from "nats";
import { JetStreamMessage } from "./Messages";

export abstract class JetStreamConsumerHandler {
    abstract readonly subject: string;

    constructor(protected readonly logger: Logger) {}

    getConsumerOptions(): ConsumerOptsBuilder | Partial<ConsumerOpts> {
        return {};
    }

    abstract handle(msg: JetStreamMessage<unknown>): Promise<void>;

    onReady(): void {
        // called when this ConsumerHandler is ready to handle messages
    }
}

export abstract class JetStreamPushConsumerHandler extends JetStreamConsumerHandler {
    protected subscription?: JetStreamSubscription;

    constructor(logger: Logger, protected readonly jetStreamClient: JetStreamClient) {
        super(logger);
    }

    async subscribe(): Promise<void> {
        this.logger.debug(`Registering consumer handler for ${this.subject}`);
        this.subscription = await this.jetStreamClient.subscribe(this.subject, this.getConsumerOptions());
    }

    getSubscription(): JetStreamSubscription {
        if (!this.subscription) {
            throw new Error("Consumer handler doesn't have a subscription yet");
        }
        return this.subscription;
    }
}

export abstract class JetStreamPullConsumerHandler extends JetStreamConsumerHandler {
    public pullOptions: Partial<PullOptions> = {};
    protected subscription?: JetStreamPullSubscription;

    constructor(logger: Logger, protected readonly jetStreamClient: JetStreamClient) {
        super(logger);
    }

    async subscribe(): Promise<void> {
        this.logger.debug(`Registering consumer handler for ${this.subject}`);
        this.subscription = await this.jetStreamClient.pullSubscribe(this.subject, this.getConsumerOptions());
    }

    getSubscription(): JetStreamPullSubscription {
        if (!this.subscription) {
            throw new Error("Consumer handler doesn't have a subscription yet");
        }
        return this.subscription;
    }
}
