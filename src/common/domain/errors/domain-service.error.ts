export class DomainServiceError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'Domain Service Error';

        Object.setPrototypeOf(this, DomainServiceError.prototype);
    }
}
