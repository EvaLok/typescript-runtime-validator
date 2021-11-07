import { ErrorObject } from "ajv";

export class ValidationError extends Error {
    constructor(
        message: string,
        public ajvErrors: Array<ErrorObject>
    ) {
        super(message);
    }

    toString() {
        return `[${this.name}] ${this.message}, details: ${JSON.stringify(this.ajvErrors)}`;
    }
}
