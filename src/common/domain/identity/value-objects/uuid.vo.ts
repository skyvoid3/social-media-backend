import { randomUUID } from 'crypto';

/*
 * Base class for UUIDV4 type across domain layer
 *
 * Many Id (i.e. sessionId, userId) value objects inherit from this base class
 *
 * This class enforces validation, eqaulity semantics across domain layer
 */
export abstract class UUIDV4 {
    protected readonly _value: string;

    protected constructor() {
        this._value = randomUUID();
    }

    get value(): string {
        return this._value;
    }

    public equals(other: UUIDV4): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return this._value;
    }

    public toJSON(): string {
        return this._value;
    }

    public static generate(): string {
        return randomUUID();
    }
}
