import { ErrorBase } from './base-error';

export class ValueObjectError extends ErrorBase {
    code = 'VALUE_OBJECT_ERROR';

    constructor(msg: string, options?: { cause?: unknown }) {
        super(msg, options);
        this.name = 'ValueObjectError';
    }
}
