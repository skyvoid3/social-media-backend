import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Role } from 'src/users/domain/value-objects/roles.vo';
import { JwtTokenPayloadProps } from '../props';

export class JwtTokenPayload {
    private readonly _userId: UserId;
    private readonly _role: Role;

    private constructor(props: JwtTokenPayloadProps) {
        this._userId = props.userId;
        this._role = props.role;
    }

    public static create(props: JwtTokenPayloadProps): JwtTokenPayload {
        return new JwtTokenPayload(props);
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
