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
import { Role } from 'src/users/domain/value-objects/roles.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';

export interface SessionProps {
    id: SessionId;
    refreshToken: RefreshToken;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    revokedAt?: RevokedAt;
    expiresAt: ExpiresAt;
    ipAddress: IpAddress;
    userAgent: UserAgent;
    userId: UserId;
}

export interface RefreshTokenProps {
    id: JwtTokenId;
    sessionId: SessionId;
    token: JwtToken;
    expiresAt: ExpiresAt;
    createdAt?: CreatedAt;
    revokedAt?: RevokedAt;
}

export interface AccessTokenProps {
    id: JwtTokenId;
    sessionId: SessionId;
    userId: UserId;
    token: JwtToken;
    expiresAt: ExpiresAt;
    createdAt?: CreatedAt;
    revokedAt?: RevokedAt;
}

export interface JwtTokenPayloadProps {
    userId: UserId;
    role: Role;
}
