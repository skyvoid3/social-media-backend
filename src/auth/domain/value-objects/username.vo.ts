import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { USERNAME_REGEX } from 'src/common/domain/identity/regex';

export class Username {
    private constructor(private readonly val: string) {}

    public static create(val: string): Username {
        const normalized = val.trim();
        if (!normalized || !Username.isValid(normalized)) {
            throw new ValueObjectError('Invalid username format');
        }
        return new Username(normalized);
    }

    private static isValid(val: string): boolean {
        return USERNAME_REGEX.test(val);
    }

    get value(): string {
        return this.val;
    }

    public equals(other: Username): boolean {
        return this.val === other.val;
    }
}
