export class DateTimeError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'DateTimeError';

        Object.setPrototypeOf(this, DateTimeError.prototype);
    }
}
