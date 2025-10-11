import { ErrorBase } from './base-error';

export class StringValidationError extends ErrorBase {
    code = 'STRING_VALIDATION_ERROR';

    constructor(msg: string, options?: { cause?: unknown }) {
        super(msg, options);
        this.name = 'StringValidationError';
    }
}
