import { ExpiresAt } from 'src/common/domain/identity/value-objects/expires-at.vo';
import { SessionId } from './value-objects/session-id.vo';
import { JwtToken } from './value-objects/token.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { IpAddress } from './value-objects/ip-address.vo';
import { UserAgent } from './value-objects/user-agent.vo';
import { JwtTokenId } from './value-objects/jwt-token-id.vo';
import { RevokedAt } from 'src/common/domain/identity/value-objects/revoked-at.vo';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';

/**
 * Common interface pattern used to define the set of strongly typed
 * domain properties (Value Objects or primitives) required to create
 * or rehydrate an Entity or Aggregate Root.
 *
 * These `Props` interfaces are typically passed into entity factory
 * methods or constructors to ensure domain invariants and maintain
 * type safety within the domain layer.
 */
export interface SessionProps {
    id: SessionId;
    refreshToken: RefreshToken;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    revokedAt?: RevokedAt;
    ipAddress: IpAddress;
    userAgent: UserAgent;
    userId: UserId;
}

export interface RefreshTokenProps {
    id: JwtTokenId;
    sessionId: SessionId;
    token: JwtToken;
    createdAt?: CreatedAt;
    revokedAt?: RevokedAt;
}

export interface AccessTokenProps {
    id: JwtTokenId;
    sessionId: SessionId;
    userId: UserId;
    token: JwtToken;
    createdAt?: CreatedAt;
}
