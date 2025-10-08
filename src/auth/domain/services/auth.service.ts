import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { AuthRepository } from '../contracts/auth.repository.contract';
import { Session } from '../entities/session.entity';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { DomainServiceError } from 'src/common/domain/errors/domain-service.error';
import { EntityError } from 'src/common/domain/errors/entity.error';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UserAgent } from '../value-objects/user-agent.vo';
import { IpAddress } from '../value-objects/ip-address.vo';
import { JwtToken } from '../value-objects/token.vo';
import { SessionCollection } from '../collections/session.collection';
import { AccessTokenProps, RefreshTokenProps, SessionProps } from '../props';
import { AccessToken } from '../entities/access-token.entity';

export class AuthService {
    /* Dependency Injection. */
    constructor(private readonly authRepo: AuthRepository) {}

    /**
     * Creates a new Session entity for a given user, generating a refresh token
     * and associating it with the session. Persists the session via the repository.
     *
     * Domain rules enforced:
     * - Only active refresh tokens can be used to create a session.
     * - The session lifecycle (revocation, rotation, expiration) is managed via the entity.
     *
     * @param userAgent {UserAgent} - The UserAgent value object representing the client's browser or device.
     * @param ipAddress {IpAddress} - The IpAddress value object representing the client's IP.
     * @param userId {UserId} - The UserId value object representing the owner of the session.
     * @param token {JwtToken} - The JWT token to use as the refresh token for this session.
     *
     * @returns {Promise<Session>} A promise resolving to the newly created Session entity.
     *
     * @throws {EntityError} If the refresh token is inactive or session creation violates domain rules.
     * @throws {EntityError} If persisting the session in the repository fails.
     * TODO: ADD ERROR HANDLING
     */
    async createSession(
        userAgent: UserAgent,
        ipAddress: IpAddress,
        userId: UserId,
        token: JwtToken,
    ): Promise<Session> {
        const sessionId = SessionId.create();
        const refreshTokenId = JwtTokenId.create();

        const refreshTokenProps: RefreshTokenProps = {
            id: refreshTokenId,
            sessionId: sessionId,
            token,
        };

        const refreshToken = RefreshToken.create(refreshTokenProps);

        const sessionProps: SessionProps = {
            id: sessionId,
            userId,
            ipAddress,
            userAgent,
            refreshToken,
        };

        const session = Session.create(sessionProps);

        await this.authRepo.saveSession(session);

        return session;
    }

    /**
     * Revokes an existing session, marking it as inactive.
     *
     * Domain rules enforced:
     * - A session cannot be revoked more than once.
     *
     * @param sessionId {SessionId} - The ID of the session to revoke.
     *
     * @returns {Promise<boolean>} A promise resolving to `true` if the session was revoked,
     *                             or `false` if the session was not found or already revoked.
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

    /**
     * Revokes all active sessions associated with a given user.
     *
     * Domain rules enforced:
     * - Only active sessions are revoked.
     *
     * @param userId {UserId} - The ID of the user whose sessions will be revoked.
     *
     * @returns {Promise<boolean>} A promise resolving to:
     *                             - `true` if all active sessions were successfully revoked.
     *                             - `false` if the number of revoked sessions did not match the number of active sessions.
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

    /**
     * Rotates the refresh token within a given session.
     *
     * Domain rules enforced:
     * - The session must exist and be active.
     * - Refresh token rotation must follow the session’s lifecycle rules.
     *
     * @param token {JwtToken} - The new JWT token to associate with the session.
     * @param sessionId {SessionId} - The ID of the session whose token will be rotated.
     *
     * @returns {Promise<RefreshToken>} A promise resolving to the newly created refresh token.
     *
     * @throws {DomainServiceError} If the session is not found or token rotation fails.
     */
    async rotateRefreshToken(token: JwtToken, sessionId: SessionId): Promise<RefreshToken> {
        const session = await this.authRepo.findSessionByToken(sessionId);
        if (!session) {
            throw new DomainServiceError('Session not found');
        }

        try {
            const refreshTokenId = JwtTokenId.create();

            const refreshTokenProps: RefreshTokenProps = {
                id: refreshTokenId,
                sessionId: sessionId,
                token,
            };

            const newRefreshToken = RefreshToken.create(refreshTokenProps);

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

    /**
     * Refreshes a session by rotating its refresh token and generating a new access token.
     *
     * Domain rules enforced:
     * - The session must exist and be active.
     * - Refresh tokens must be valid and associated with the session.
     *
     * @param refreshTokenId {JwtTokenId} - The ID of the refresh token used to locate the session.
     * @param refreshToken {JwtToken} - The new refresh token payload.
     * @param accessToken {JwtToken} - The new access token payload.
     *
     * @returns {Promise<{ accessToken: AccessToken; refreshToken: RefreshToken }>}
     *          A promise resolving to the new access and refresh tokens.
     *
     * @throws {DomainServiceError} If the session is not found or revoked.
     */
    async refreshSession(
        refreshTokenId: JwtTokenId,
        refreshToken: JwtToken,
        accessToken: JwtToken,
    ): Promise<{ accessToken: AccessToken; refreshToken: RefreshToken }> {
        const session = await this.authRepo.findSessionByToken(refreshTokenId);

        if (!session || !session.active) {
            throw new DomainServiceError('Session not found or revoked');
        }

        const newRefreshToken = await this.rotateRefreshToken(refreshToken, session.id);

        const accessTokenId = JwtTokenId.create();

        const accessTokenProps: AccessTokenProps = {
            id: accessTokenId,
            token: accessToken,
            sessionId: session.id,
            userId: session.userId,
        };

        const newAccessToken = AccessToken.create(accessTokenProps);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    /**
     * Retrieves a session by its ID.
     *
     * @param sessionId {SessionId} - The ID of the session to retrieve.
     *
     * @returns {Promise<Session | null>} A promise resolving to the session entity if found,
     *                                   or `null` if no session exists with the given ID.
     */
    async getSessionById(sessionId: SessionId): Promise<Session | null> {
        const session = await this.authRepo.findSessionById(sessionId);

        if (!session) {
            return null;
        }

        return session;
    }

    /**
     * Retrieves all sessions associated with a given user.
     *
     * @param userId {UserId} - The ID of the user whose sessions to retrieve.
     *
     * @returns {Promise<SessionCollection | null>} A promise resolving to a SessionCollection if sessions are found,
     *                                              or `null` if no sessions exist for the user.
     */
    async getAllSessionsForUser(userId: UserId): Promise<SessionCollection | null> {
        const sessions = await this.authRepo.findAllSessionsForUser(userId);

        if (sessions.count === 0) {
            return null;
        }

        return sessions;
    }

    /**
     * Revokes all sessions that have expired.
     *
     * Domain rules enforced:
     * - Only sessions identified as expired are revoked.
     *
     * @returns {Promise<number>} A promise resolving to the number of sessions that were revoked.
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

    /**
     * Revokes all inactive sessions.
     *
     * Domain rules enforced:
     * - Only sessions marked as inactive are revoked.
     *
     * @returns {Promise<number>} A promise resolving to the number of inactive sessions that were revoked.
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
