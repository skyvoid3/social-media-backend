import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { SessionId } from '../value-objects/session-id.vo';
import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { UserAgent } from '../value-objects/user-agent.vo';
import { IpAddress } from '../value-objects/ip-address.vo';
import { SessionProps } from '../props';
import { RefreshToken } from './refresh-token.entity';
import { RevokedAt } from 'src/common/domain/identity/value-objects/revoked-at.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { EntityError } from 'src/common/domain/errors/entity.error';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { DateTime } from 'src/common/domain/utils/date-time';

export class Session {
    private _id: SessionId;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _expiresAt: ExpiresAt;
    private _refreshToken: RefreshToken;
    private _userAgent: UserAgent;
    private _ipAddress: IpAddress;
    private _revokedAt: RevokedAt;
    private _userId: UserId;

    private constructor(props: SessionProps) {
        this._id = props.id;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._expiresAt = props.expiresAt;
        this._refreshToken = props.refreshToken;
        this._userAgent = props.userAgent;
        this._ipAddress = props.ipAddress;
        this._revokedAt = props.revokedAt ?? RevokedAt.none();
        this._userId = props.userId;
    }

    public static create(props: SessionProps) {
        return new Session(props);
    }

    revoke(): void {
        this._refreshToken.revoke();
        this._revokedAt = RevokedAt.now();
        this.touch();
    }

    rotateRefreshToken(newToken: RefreshToken): void {
        if (this.revoked) {
            throw new EntityError('Cannot rotate a revoked session');
        }

        this._refreshToken.revoke();
        this._refreshToken = newToken;

        this.touch();
    }

    /* private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* getters */

    get id(): SessionId {
        return this._id;
    }
    get createdAt(): CreatedAt {
        return this._createdAt;
    }
    get expiresAt(): ExpiresAt {
        return this._expiresAt;
    }
    get refreshToken(): RefreshToken {
        return this._refreshToken;
    }
    get userAgent(): UserAgent {
        return this._userAgent;
    }
    get ipAddress(): IpAddress {
        return this._ipAddress;
    }

    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get userId(): UserId {
        return this._userId;
    }

    get active(): boolean {
        return !this._revokedAt.isRevoked() && this._refreshToken.isActive();
    }

    get revoked(): boolean {
        return this._revokedAt.isRevoked();
    }

    get expired(): boolean {
        return this.expiresAt.isExpired();
    }

    get revokedAt(): RevokedAt {
        return this._revokedAt;
    }
}
