import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { USER_ROLES, UserRole, isValidUserRole } from 'src/common/domain/enums/user-role.enum';

export class Role {
    private constructor(private readonly value: UserRole) {}

    public static create(value: string): Role {
        const normalized = value.trim().toLowerCase();

        if (!isValidUserRole(normalized)) {
            throw new ValueObjectError(`Invalid role. Valid roles are: ${USER_ROLES.join(', ')}`);
        }

        return new Role(normalized);
    }

    public equals(other: Role): boolean {
        return other ? this.value === other.value : false;
    }

    public getValue(): UserRole {
        return this.value;
    }

    public is(role: UserRole): boolean {
        return this.value === role;
    }

    public toString(): string {
        return this.value;
    }
}
