import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

/* This Value Object breaks immutability. Because creating new VO for every new comment is very expensive.
 * This is the design choice for now. When this bacomes a bottleneck when we scale (i hope we will)
 * other design choices will be made
 */
export class CommentsCount {
    private _value: number;

    private constructor(value: number) {
        if (value < 0) {
            throw new ValueObjectError('Comments count cannot be negative');
        }
        this._value = value;
    }

    public static create(value: number): CommentsCount {
        return new CommentsCount(value);
    }

    public static zero(): CommentsCount {
        return new CommentsCount(0);
    }

    public increment(): void {
        this._value++;
    }

    public decrement(): void {
        if (this._value === 0) {
            throw new ValueObjectError('Cannot decrement below zero');
        }
        this._value--;
    }

    public reset(): void {
        this._value = 0;
    }

    public equals(other: CommentsCount): boolean {
        return this._value === other._value;
    }

    get value(): number {
        return this._value;
    }

    public toJSON(): number {
        return this._value;
    }
}
