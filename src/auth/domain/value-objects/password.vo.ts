import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { PASSWORD_REGEX } from 'src/common/domain/identity/regex';

export class Password {
    private constructor(private readonly val: string) {}

    static create(val: string): Password {
        if (!val.trim() || !Password.isValid(val)) {
            throw new ValueObjectError('Invalid password format');
        }

        return new Password(val);
    }

    private static isValid(password: string): boolean {
        return PASSWORD_REGEX.test(password);
    }

    get value(): string {
        return this.val;
    }

    public equals(other: Password): boolean {
        return this.val === other.val;
    }
}
