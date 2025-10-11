import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { USER_ROLES, UserRole, isValidUserRole } from 'src/common/domain/enums/user-role.enum';

/*
 * Domain representation of User Role
 *
 * This value-object enforces validation, normalization,
 * and equality semantics within the domain layer
 *
 * Is used inside User entity to assign user a role
 */
export class Role {
    private constructor(private readonly _value: UserRole) {}

    public static create(_value: string): Role {
        const normalized = _value.trim().toLowerCase();

        if (!isValidUserRole(normalized)) {
            throw new ValueObjectError(`Invalid role. Valid roles are: ${USER_ROLES.join(', ')}`);
        }

        return new Role(normalized);
    }

    public equals(other: Role): boolean {
        return other ? this.value === other.value : false;
    }

    public value(): UserRole {
        return this._value;
    }

    public is(role: UserRole): boolean {
        return this._value === role;
    }

    public toString(): string {
        return this._value;
    }
}
