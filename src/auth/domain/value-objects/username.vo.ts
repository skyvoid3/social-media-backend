import { USERNAME_REGEX } from 'src/common/domain/identity/regex';
import { validateByRegex } from 'src/common/domain/utils/validate-string';

/*
 * Domain representation of Username
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 */
export class Username {
    private constructor(private readonly _value: string) {}

    static create(value: string) {
        const normalized = validateByRegex(value, USERNAME_REGEX, 'username');
        return new Username(normalized);
    }

    get value(): string {
        return this._value;
    }
}
