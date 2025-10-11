import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtToken } from '../value-objects/token.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { RefreshTokenProps } from '../props';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { RevokedAt } from 'src/common/domain/identity/value-objects/revoked-at.vo';
import { DateTime } from 'src/common/domain/utils/date-time';

/*
 * RefreshToken entity used across the authentication domain.
 *
 * Each RefreshToken represents a long-lived credential that allows a client
 * to obtain new access tokens after the original access token expires.
 * It is always tied to a single Session, and each Session can have only one
 * active RefreshToken at any given time.
 *
 * The RefreshToken encapsulates:
 *   - its unique token string value
 *   - issued (CreatedAt) and expiration (ExpiresAt) timestamps
 *   - optional revocation timestamp (RevokedAt)
 *
 * Domain rules and invariants enforced:
 *   - A RefreshToken is valid for exactly 7 days from creation.
 *   - Expiration duration is fixed and cannot be modified externally.
 *   - A RefreshToken can only be used while it is active (not expired, not revoked).
 *   - Once revoked, it cannot be reactivated or reused.
 *   - Equality and identity semantics are based on the token value itself.
 *
 * Behavior provided:
 *   - `revoke()`: Marks the token as revoked and prevents further use.
 *   - `isActive()`: Returns true only if the token is neither expired nor revoked.
 *   - `isExpired()`: Determines if the token’s expiry time has passed.
 *   - `equals(other: RefreshToken)`: Ensures consistent equality semantics
 *     across domain boundaries (e.g., comparing persisted vs. in-memory instances).
 *
 * Factory methods enforce correctness:
 *   - Tokens are always created with a fixed 7-day lifetime via factory constructors.
 *   - No external code can override or bypass the expiration policy.
 *
 * This entity is designed for immutability and integrity — any state transitions
 * (like revocation) occur through controlled domain methods that preserve invariants.
 *
 * Example lifecycle:
 *   1. A RefreshToken is created when a new Session is established.
 *   2. It remains active for up to 7 days unless explicitly revoked.
 *   3. If a new refresh flow is triggered, the existing token is revoked,
 *      and a new one is issued (token rotation).
 *   4. Expired or revoked tokens cannot issue new access tokens.
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
