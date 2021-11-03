import { SubscriptionOptions } from "nats";
import { AirlockMessage, Message } from "./Messages";
import { AIRLOCK_VERBS } from "./NatsRunner";

abstract class Handler {
    abstract readonly subject: string;

    getSubscriptionOptions(): SubscriptionOptions {
        return {};
    }
}

export abstract class PrivateHandler extends Handler {
    serviceScopedSubject = true;

    abstract handle(msg: Message): Promise<unknown>;
}

export abstract class AirlockHandler extends Handler {
    abstract readonly verb: AIRLOCK_VERBS;

    abstract handle(msg: AirlockMessage): Promise<unknown>;
}
