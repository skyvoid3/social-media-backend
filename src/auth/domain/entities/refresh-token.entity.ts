import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtToken } from '../value-objects/token.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { RefreshTokenProps } from '../props';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { RevokedAt } from 'src/common/domain/identity/value-objects/revoked-at.vo';
import { DateTime } from 'src/common/domain/utils/date-time';

/*
 * RefreshToken entity used across auth domain.
 * The refreshToken is stored inside Session.
 * Each session can have only one refresh token
 *
 * This entity class enforces validation, equality semantics across auth domain
 * Also provides methods for token revokation
 *
 * The factory methods enforces that tokens expire after 7 days. No external functions can
 * change that parameter
 */
export class RefreshToken {
    private _id: JwtTokenId;
    private _sessionId: SessionId;
    private _token: JwtToken;
    private _expiresAt: ExpiresAt;
    private _createdAt: CreatedAt;
    private _revokedAt: RevokedAt;

    private constructor(props: RefreshTokenProps) {
        this._id = props.id;
        this._sessionId = props.sessionId;
        this._token = props.token;
        // Expires after 7 days. The DateTime class will be changed to a more readable model
        this._expiresAt = ExpiresAt.create(DateTime.now().add({ days: 7 }));
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._revokedAt = props.revokedAt ?? RevokedAt.none();
    }

    public static create(props: RefreshTokenProps): RefreshToken {
        return new RefreshToken(props);
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
    get token(): JwtToken {
        return this._token;
    }
    get expiresAt(): ExpiresAt {
        return this._expiresAt;
    }
    get createdAt(): CreatedAt {
        return this._createdAt;
    }
    get revoked(): boolean {
        return this._revokedAt.isRevoked();
    }

    get expired(): boolean {
        return this._expiresAt.isExpired();
    }

    get active(): boolean {
        return !this.revoked && !this.expired;
    }
}
