/**
 * Base class for custom errors.
 *
 * Extending this class allows you to create structured errors with:
 * - A unique `code` identifying the type of error (e.g., "DATE_TIME_ERROR").
 * - Proper stack trace captured at the point the error is thrown.
 * - Optional `cause` for error chaining.
 *
 * Subclasses must define the abstract `code` property.
 *
 * Example usage:
 * ```ts
 * class DateTimeError extends ErrorBase {
 *   code = 'DATE_TIME_ERROR';
 * }
 *
 * throw new DateTimeError('Invalid date', { cause: originalError });
 * ```
 */
export abstract class ErrorBase extends Error {
    abstract code: string;

    constructor(
        readonly msg: string,
        readonly options?: { cause?: unknown },
    ) {
        super(msg);
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Serializes the error into a plain object suitable for logging or JSON output.
     * - `message` is the error message.
     * - `code` is the error code defined in the subclass.
     * - `stack` is the captured stack trace.
     * - `cause` is the optional underlying error, stringified if present.
     */
    toJSON() {
        return {
            message: this.msg,
            code: this.code,
            stack: this.stack,
            cause: this.cause ? JSON.stringify(this.cause) : undefined,
        };
    }
}
