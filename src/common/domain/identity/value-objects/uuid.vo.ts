import { randomUUID } from 'crypto';

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
