import { ErrorBase } from './base-error';

export class DateTimeError extends ErrorBase {
    code = 'DATE_TIME_ERROR';

    constructor(msg: string, options?: { cause?: unknown }) {
        super(msg, options);
        this.name = 'DateTimeError';

    }
}
