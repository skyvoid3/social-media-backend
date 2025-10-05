import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { JWT_TOKEN_REGEX } from 'src/common/domain/identity/regex';

export class JwtToken {
    private constructor(private readonly val: string) {}

    static create(val: string): JwtToken {
        const normalized = val.trim();
        if (!normalized || !JwtToken.isValid(normalized)) {
            throw new ValueObjectError('Invalid token format');
        }

        return new JwtToken(normalized);
    }

    private static isValid(val: string): boolean {
        return JWT_TOKEN_REGEX.test(val);
    }

    get value(): string {
        return this.val;
    }

    public equals(other: JwtToken): boolean {
        return this.val === other.val;
    }
}
