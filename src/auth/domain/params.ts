import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { UserAgent } from './value-objects/user-agent.vo';
import { IpAddress } from './value-objects/ip-address.vo';
import { JwtToken } from './value-objects/token.vo';
import { SessionId } from './value-objects/session-id.vo';

export interface CreateSessionParams {
    userId: UserId;
    userAgent: UserAgent;
    ipAddress: IpAddress;
    expiresInDays: number;
}

export interface CreateRefreshTokenParams {
    expiresInDays: number;
    token: JwtToken;
    sessionId: SessionId;
}
