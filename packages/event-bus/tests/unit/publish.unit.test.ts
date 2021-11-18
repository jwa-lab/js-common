import {EventEmitterEventBus} from "../../src";

describe("Given Event Emitter", () => {
    let eventEmitter: EventEmitterEventBus;

    beforeAll(() => {
        eventEmitter = new EventEmitterEventBus();
    });

    describe("When called to publish a message", () => {
        it("Then it should publish the message", () => {
            jest.spyOn(eventEmitter, 'publish');
            eventEmitter.publish({name: "THIS_IS_MY_EVENT"});
            expect(eventEmitter.publish).toHaveBeenCalled();
        })
    })
})
