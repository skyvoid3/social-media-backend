import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Role } from 'src/users/domain/value-objects/roles.vo';

/*
 * Domain representation of JwtToken paylad
 * payload contains user-id and users role
 *
 * This value-object enforces validation
 * and equality semantics within the domain layer
 */
export class JwtTokenPayload {
    private constructor(
        private readonly _userId: UserId,
        private readonly _role: Role,
    ) {}

    public static create(userId: UserId, role: Role): JwtTokenPayload {
        return new JwtTokenPayload(userId, role);
    }

    public equals(other: JwtTokenPayload): boolean {
        if (!other) return false;
        return this.userId.equals(other.userId) && this.role.equals(other.role);
    }

    public toJSON() {
        return {
            userId: this.userId.value,
            role: this.role.toString(),
        };
    }

    get userId(): UserId {
        return this._userId;
    }

    get role(): Role {
        return this._role;
    }
}
