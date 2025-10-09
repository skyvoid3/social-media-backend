import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtToken } from '../value-objects/token.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { AccessTokenProps } from '../props';
import { DateTime } from 'src/common/domain/utils/date-time';

/*
 * AccessToken entity used across auth domain.
 * The accessToken is issued by session and is saved in memory
 *
 *
 * This entity class enforces validation, equality semantics across auth domain
 *
 *
 * The factory methods enforces that tokens expire after 1 hour. No external functions can
 * change that parameter
 */
export class AccessToken {
    private _id: JwtTokenId;
    private _sessionId: SessionId;
    private _userId: UserId;
    private _token: JwtToken;
    private _expiresAt: ExpiresAt;
    private _createdAt: CreatedAt;

    private constructor(props: AccessTokenProps) {
        this._id = props.id;
        this._sessionId = props.sessionId;
        this._userId = props.userId;
        this._token = props.token;
        // Expires after 1 hour.
        this._expiresAt = ExpiresAt.create(DateTime.now().add({ hours: 1 }));
        this._createdAt = props.createdAt ?? CreatedAt.now();
    }

    public static create(props: AccessTokenProps): AccessToken {
        return new AccessToken(props);
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

    /**
     * Checks equality with another AccessToken.
     * Tokens are equal if their IDs are the same.
     */
    public equals(other: AccessToken): boolean {
        if (!other) return false;
        return this._id.equals(other.id);
    }
}
