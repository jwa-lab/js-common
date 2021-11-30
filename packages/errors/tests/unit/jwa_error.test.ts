import {JWAError} from "../../src";

describe("Given JWAError", () => {
    describe("When called nominally", () => {
        it("Then it should raise the error normally.", () => {
            const errorThrower = () => {
                throw new JWAError(400, "A lambda JWAError", "LAMBDA_JWA_ERROR", undefined)
            }

            expect(
                () => errorThrower()
            ).toThrowError(
                "A lambda JWAError"
            );
        })

        it("Then it should contain the error's data without the origin if there is no origin.", () => {
            const errorThrower = () => {
                let error;

                try {
                    throw new JWAError(400, "A lambda JWAError", "LAMBDA_JWA_ERROR", undefined)
                } catch (e) {
                    error = e;
                }

                return JSON.parse(JSON.stringify(error));
            }

            expect(
                errorThrower()
            ).toEqual(
                {
                    "errorCode": "LAMBDA_JWA_ERROR",
                    "httpCode": 400,
                    "message": "A lambda JWAError",
                    "name": "JWAError",
                }
            );
        });

        it("Then it should contain the error's data with the origin if there is an origin.", () => {
            const errorThrower = () => {
                let error;

                try {
                    try {
                        throw new JWAError(400, "A lambda ORIGIN JWAError", "LAMBDA_ORIGIN_JWA_ERROR", undefined)
                    } catch (origin_error) {
                        throw new JWAError(400, "A lambda JWAError", "LAMBDA_JWA_ERROR", origin_error)
                    }
                } catch (e) {
                    error = e;
                }

                return JSON.parse(JSON.stringify(error));
            }

            expect(
                errorThrower()
            ).toEqual(
                {
                    "errorCode": "LAMBDA_JWA_ERROR",
                    "httpCode": 400,
                    "message": "A lambda JWAError",
                    "name": "JWAError",
                    "origin": {
                        "errorCode": "LAMBDA_ORIGIN_JWA_ERROR",
                        "httpCode": 400,
                        "message": "A lambda ORIGIN JWAError",
                        "name": "JWAError",
                    }
                }
            );
        });
    });

    describe("When called with an invalid HTTP Code", () => {
        it("Then it should throw an error indicating a bad HTTP Code parameter.", () => {
            const errorThrower = () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                throw new JWAError("invalid_http_code", "A lambda JWAError", "LAMBDA_JWA_ERROR", undefined)
            }

            expect(
                () => errorThrower()
            ).toThrowError(
                "Invalid HTTP code."
            );
        })
    });

    describe("When called with an invalid Error Code", () => {
        it("Then it should throw an error indicating a bad HTTP Code parameter.", () => {
            const errorThrower = () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                throw new JWAError(400, "A lambda JWAError", null, undefined)
            }

            expect(
                () => errorThrower()
            ).toThrowError(
                "Invalid error code."
            );
        })
    });

    describe("When called with an invalid Origin Error if any", () => {
        it("Then it should throw an error indicating a bad Origin Error type.", () => {
            const errorThrower = () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                throw new JWAError(400, "A lambda JWAError", "LAMBDA_JWA_ERROR", "invalid_error")
            }

            expect(
                () => errorThrower()
            ).toThrowError(
                "Invalid origin error, got 'string' but the expected type is 'Error'."
            );
        })
    });
})
