import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtToken } from '../value-objects/token.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { RevokedAt } from 'src/common/domain/identity/value-objects/revoked-at.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { AccessTokenProps } from '../props';
import { DateTime } from 'src/common/domain/utils/date-time';

export class AccessToken {
    private _id: JwtTokenId;
    private _sessionId: SessionId;
    private _userId: UserId;
    private _token: JwtToken;
    private _expiresAt: ExpiresAt;
    private _createdAt: CreatedAt;
    private _revokedAt: RevokedAt;

    private constructor(props: AccessTokenProps) {
        this._id = props.id;
        this._sessionId = props.sessionId;
        this._userId = props.userId;
        this._token = props.token;
        // Expires after 7 days.
        this._expiresAt = ExpiresAt.create(DateTime.now().add({ days: 7 }));
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._revokedAt = props.revokedAt ?? RevokedAt.none();
    }

    public static create(props: AccessTokenProps): AccessToken {
        return new AccessToken(props);
    }

    revoke(): void {
        if (!this._revokedAt.isRevoked()) {
            this._revokedAt = RevokedAt.now();
        }
    }

    /* getters */

    get id(): JwtTokenId {
        return this._id;
    }

    get sessionId(): SessionId {
        return this._sessionId;
    }

    get userId(): UserId {
        return this._userId;
    }

    get token(): JwtToken {
        return this._token;
    }

    get expiresAt(): ExpiresAt {
        return this._expiresAt;
    }

    get createdAt(): CreatedAt {
        return this._createdAt;
    }

    get expired(): boolean {
        return this._expiresAt.isExpired();
    }

    get revoked(): boolean {
        return this._revokedAt.isRevoked();
    }

    get active(): boolean {
        return !this.revoked && !this.expired;
    }
}
