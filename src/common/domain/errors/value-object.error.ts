export class ValueObjectError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'ValueObjectError';

        Object.setPrototypeOf(this, ValueObjectError.prototype);
    }
}
