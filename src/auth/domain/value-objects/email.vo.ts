import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { EMAIL_REGEX } from 'src/common/domain/identity/regex';

export class Email {
    private constructor(private readonly val: string) {}

    static create(val: string): Email {
        const normalized = val.trim();
        if (!normalized || !Email.isValid(normalized)) {
            throw new ValueObjectError('Invalid email format');
        }

        return new Email(normalized);
    }

    private static isValid(val: string): boolean {
        return EMAIL_REGEX.test(val);
    }

    get value(): string {
        return this.val;
    }

    public equals(other: Email): boolean {
        return this.val === other.val;
    }
}
