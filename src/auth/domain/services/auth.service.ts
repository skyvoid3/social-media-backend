import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { AuthRepository } from '../contracts/auth.repository.contract';
import { Session } from '../entities/session.entity';
import { RefreshTokenFactory } from '../factories/refresh-token.factory';
import { SessionFactory } from '../factories/session.factory';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { DomainServiceError } from 'src/common/domain/errors/domain-service.error';
import { EntityError } from 'src/common/domain/errors/entity.error';
import { RefreshToken } from '../entities/refresh-token.entity';
import { AccessTokenFactory } from '../factories/access-token.factory';
import { UserAgent } from '../value-objects/user-agent.vo';
import { IpAddress } from '../value-objects/ip-address.vo';
import { JwtToken } from '../value-objects/token.vo';
import { SessionCollection } from '../collections/session.collection';

export class AuthService {
    /* Dependency Injection. */
    constructor(private readonly authRepo: AuthRepository) {}

    /*
     * Creates new session.
     * SessionId generation is handled in this service. Because it needs to be shared by
     * refreshToken and Session. On the other hand the refreshToken id is created internally
     */
    async createSession(
        sp: {
            userAgent: UserAgent;
            ipAddress: IpAddress;
            userId: UserId;
            params?: {
                expiresInDays?: number;
            };
        },
        tp: {
            token: JwtToken;
            sessionId: SessionId;
            params?: { expiresInDays?: number };
        },
    ): Promise<Session> {
        const sessionId = SessionId.create();

        const refreshToken = RefreshTokenFactory.createNew(tp.token, tp.sessionId, {
            expiresInDays: tp.params?.expiresInDays,
        });

        const session = SessionFactory.createNew(
            sp.userAgent,
            sp.ipAddress,
            sp.userId,
            refreshToken,
            sessionId,
            { expiresInDays: sp.params?.expiresInDays },
        );

        await this.authRepo.saveSession(session);

        return session;
    }

    /*
     * Revokes Existing session
     * Returns true if session was found and revoked
     *         false if session was not found or was already revoked
     */
    async revokeSession(sessionId: SessionId): Promise<boolean> {
        const session = await this.authRepo.findSessionById(sessionId);
        if (!session || session.revoked) {
            return false;
        }

        session.revoke();
        await this.authRepo.saveSession(session);
        return true;
    }

    /*
     * Revokes all sessions for a user
     * Returns true if the deleted sessions count matches active sessions count
     *         false if the deleted sessions count dont match the active sessions count
     */
    async revokeAllSessionsForUser(userId: UserId): Promise<boolean> {
        const activeSessions = await this.authRepo.countActiveSessionsForUser(userId);

        if (!activeSessions) {
            return true;
        }

        const revokedSessions = await this.authRepo.revokeAllSessionsForUser(userId);

        if (activeSessions !== revokedSessions) {
            return false;
        }

        return true;
    }

    /*
     * Rotates refreshToken inside a session
     * Returns new refreshToken on success
     */
    async rotateRefreshToken(
        token: JwtToken,
        sessionId: SessionId,
        params?: { expiresInDays?: number },
    ): Promise<RefreshToken> {
        const session = await this.authRepo.findSessionByToken(sessionId);
        if (!session) {
            throw new DomainServiceError('Session not found');
        }

        try {
            const newRefreshToken = RefreshTokenFactory.createNew(token, sessionId, {
                expiresInDays: params?.expiresInDays,
            });

            session.rotateRefreshToken(newRefreshToken);
            await this.authRepo.saveSession(session);
            return newRefreshToken;
        } catch (error) {
            if (error instanceof EntityError) {
                throw new DomainServiceError(`Failed to rotate token: ${error.message}`);
            }
            throw error;
        }
    }

    /* Refreshes and rotates the token inside a session
     * Issues new accessToken
     */

    async refreshSession(
        refreshTokenId: JwtTokenId,
        params: {
            refreshToken: JwtToken;
            refreshTokenExpiresInDays?: number;
            accessToken: JwtToken;
            accessTokenExpiresInSeconds?: number;
        },
    ) {
        const session = await this.authRepo.findSessionByToken(refreshTokenId);

        if (!session || !session.active) {
            throw new DomainServiceError('Session not found or revoked');
        }

        const newRefreshToken = await this.rotateRefreshToken(params.refreshToken, refreshTokenId, {
            expiresInDays: params.refreshTokenExpiresInDays,
        });

        const accessToken = AccessTokenFactory.createNew(
            params.accessToken,
            session.id,
            session.userId,
            { expiresInSeconds: params.accessTokenExpiresInSeconds },
        );

        return { accessToken, refreshToken: newRefreshToken };
    }

    /* Finds session by sessionId
     * Returns Session on success
     *         null if session was not found
     */
    async getSessionById(sessionId: SessionId): Promise<Session | null> {
        const session = await this.authRepo.findSessionById(sessionId);

        if (!session) {
            return null;
        }

        return session;
    }

    /* Finds all sessions for a user
     * Returns SessionCollection on success
               null if no session was found
     */
    async getAllSessionsForUser(userId: UserId): Promise<SessionCollection | null> {
        const sessions = await this.authRepo.findAllSessionsForUser(userId);

        if (sessions.count === 0) {
            return null;
        }

        return sessions;
    }

    /*
     * Revokes all expired sessions
     * Returns number of sessions revoked
     */
    async revokeExpiredSessions(): Promise<number> {
        const expiredSessions = await this.authRepo.findExpiredSessions();

        if (expiredSessions.count === 0) {
            return 0;
        }

        const revokedCount = expiredSessions.revokeExpired();

        await this.authRepo.saveSessions(expiredSessions);

        return revokedCount;
    }

    /*
     * Revokes all inactive sessions
     * Returns number of sessions revoked
     */
    async revokeInactiveSessions(): Promise<number> {
        const inactiveSessions = await this.authRepo.findInactiveSessions();

        if (inactiveSessions.count === 0) {
            return 0;
        }

        const inactiveCount = inactiveSessions.revokeInactive();

        await this.authRepo.saveSessions(inactiveSessions);

        return inactiveCount;
    }
}
