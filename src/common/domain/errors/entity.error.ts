import { ErrorBase } from './base-error';

export class EntityError extends ErrorBase {
    code = 'ENTITY_ERROR';

    constructor(msg: string, options?: { cause?: unknown }) {
        super(msg, options);
        this.name = 'EntityError';
    }
}
