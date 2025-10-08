export class StringValidationError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'StringValidationError';

        Object.setPrototypeOf(this, StringValidationError.prototype);
    }
}
