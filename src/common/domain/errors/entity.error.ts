export class EntityError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'EntityError';

        Object.setPrototypeOf(this, EntityError.prototype);
    }
}
