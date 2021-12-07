import { NatsRunner } from "../../dist/NatsRunner";

export class StoppableNatsRunner extends NatsRunner {
    constructor(cwd) {
        super(cwd);
    }

    async stop() {
        await this.natsConnection.drain();
        await this.natsConnection.close();
    }
}
