export class JWAError extends Error {
    readonly httpCode: number;
    readonly errorCode: string;
    readonly origin?: Error;

    constructor(
        httpCode: number,
        message: string,
        errorCode: string,
        origin?: Error
    ) {
        super();
        this.name = this.constructor.name;

        if (!httpCode || typeof httpCode !== "number") {
            throw new Error("Invalid HTTP Code");
        }

        if (!errorCode || errorCode === "" || typeof errorCode !== "string") {
            throw new Error("Invalid error code.");
        }

        if (origin && !(origin instanceof Error)) {
            throw new Error(
                `Invalid origin error, got '${typeof origin}' but the expected type is 'Error'`
            );
        }

        this.httpCode = httpCode;
        this.message = message;
        this.errorCode = errorCode;
        this.origin = origin;
    }
}
