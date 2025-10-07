import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { UserAgent } from './value-objects/user-agent.vo';
import { IpAddress } from './value-objects/ip-address.vo';
import { JwtToken } from './value-objects/token.vo';

export interface CreateSessionParams {
    userId: UserId;
    userAgent: UserAgent;
    ipAddress: IpAddress;
    expiresInDays: number;
}

export interface CreateAccessTokenParams {
    expiresInSeconds: number;
    token: JwtToken;
}

export interface RefreshSessionParams {
    refreshToken: JwtToken;
    refreshTokenExpiresInDays: number;
    accessToken: JwtToken;
    accessTokenExpiresInSeconds: number;
}
