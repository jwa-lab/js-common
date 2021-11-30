import { natsRunner } from "../utils/test-service/service";

describe("Given Nats Runner", () => {
    describe("When starting a service", () => {
        it("Should start with nats runner properly.", async() => {
            await natsRunner.start();
            await natsRunner.stop();
        })
    });
})
