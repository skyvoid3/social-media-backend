import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtToken } from '../value-objects/token.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { RefreshTokenProps } from '../props';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { RevokedAt } from 'src/common/domain/identity/value-objects/revoked-at.vo';

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
        this._expiresAt = props.expiresAt;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._revokedAt = props.revokedAt ?? RevokedAt.none();
    }

    public static create(props: RefreshTokenProps): RefreshToken {
        return new RefreshToken(props);
    }

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

    revoke(): void {
        if (!this._revokedAt.isRevoked()) {
            this._revokedAt = RevokedAt.now();
        }
    }

    isActive(): boolean {
        return !this._revokedAt.isRevoked() && !this._expiresAt.isExpired();
    }
}
