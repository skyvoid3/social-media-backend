export class DomainServiceError extends Error {
    constructor(msg: string, options?: { cause?: unknown }) {
        super(msg, options);
        this.name = 'Domain Service Error';

        Object.setPrototypeOf(this, DomainServiceError.prototype);
    }
}
