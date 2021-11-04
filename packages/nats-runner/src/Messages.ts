import { JsMsg, JSONCodec, Msg, MsgHdrs } from "nats";
import { parseJwtToNats } from "./tokenParser";

export class AirlockMessage {
    subject: string;
    reply?: string;
    sid: number;
    body: unknown;
    query: Record<string, unknown>;
    headers: Record<string, unknown>;

    constructor({ subject, reply, sid, data, headers }: Msg) {
        const { body, query } = JSONCodec().decode(data) as {
            body: unknown;
            query: Record<string, unknown>;
        };

        this.subject = subject;
        this.reply = reply;
        this.sid = sid;
        this.body = body;
        this.query = query;
        this.headers = headers ? natsHeadersToObject(headers) : {};
    }
}

export class Message {
    subject: string;
    reply?: string;
    sid: number;
    data: unknown;
    headers: Record<string, unknown>;

    constructor({ subject, reply, sid, data, headers }: Msg) {
        this.subject = subject;
        this.reply = reply;
        this.sid = sid;
        this.data = String(data) ? JSONCodec<Record<string, unknown>>().decode(data) : null;
        this.headers = headers ? natsHeadersToObject(headers) : {};
    }
}

export class JetStreamMessage<T> {
    data: T | null;
    msg: JsMsg;

    constructor(msg: JsMsg) {
        this.msg = msg;
        this.data = String(msg.data) ? JSONCodec<T>().decode(msg.data) : null;
    }
}

function natsHeadersToObject(headers: MsgHdrs): Record<string, unknown> {
    const obj = Object.create(null);

    for (const [key] of headers) {
        obj[key] = headers.get(key);
    }

    if (obj.authorization) {
        Object.assign(obj, parseJwtToNats(obj.authorization));
    }

    return obj;
}
