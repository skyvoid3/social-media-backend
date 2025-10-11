import { ErrorBase } from './base-error';

export class DomainServiceError extends ErrorBase {
    code = 'DOMAIN_SERVICE_ERROR';

    constructor(msg: string, options?: { cause?: unknown }) {
        super(msg, options);
        this.name = 'DomainServiceError';
    }
}
