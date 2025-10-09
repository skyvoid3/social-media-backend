import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { AuthRepository } from '../contracts/auth.repository.contract';
import { Session } from '../entities/session.entity';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';
import { DomainServiceError } from 'src/common/domain/errors/domain-service.error';
import { RefreshToken } from '../entities/refresh-token.entity';
import { UserAgent } from '../value-objects/user-agent.vo';
import { IpAddress } from '../value-objects/ip-address.vo';
import { JwtToken } from '../value-objects/token.vo';
import { SessionCollection } from '../collections/session.collection';
import { AccessTokenProps, RefreshTokenProps, SessionProps } from '../props';
import { AccessToken } from '../entities/access-token.entity';

/**
 * Domain Layer Service — AuthService
 *
 * The AuthService coordinates domain entities, value objects, and repository contracts
 * to implement authentication-related business logic.
 *
 * Responsibilities include:
 * - Managing multiple active sessions per user.
 * - Handling refresh and access token rotation.
 * - Issuing new tokens for authenticated users.
 * - Revoking expired or inactive sessions.
 * - Enforcing domain rules around session lifecycle and token validity.
 *
 * This service operates purely within the domain layer and does not handle
 * transport, HTTP concerns, or persistence details directly.
 */
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
     * @throws {DomainServiceError} If Session creation or authRepo throws error
     */
    async createSession(
        userAgent: UserAgent,
        ipAddress: IpAddress,
        userId: UserId,
        token: JwtToken,
    ): Promise<Session> {
        const sessionId = SessionId.create();

        const refreshTokenProps: RefreshTokenProps = {
            id: JwtTokenId.create(),
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

        try {
            const session = Session.create(sessionProps);

            await this.authRepo.saveSession(session);

            return session;
        } catch (err) {
            throw new DomainServiceError('Failed to create new session', { cause: err });
        }
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
     *
     * @throws {DomainServiceError} if the authRepo throws error
     */

    async revokeSession(sessionId: SessionId): Promise<boolean> {
        try {
            const session = await this.authRepo.findSessionById(sessionId);
            if (!session || session.revoked) {
                return false;
            }

            session.revoke();

            await this.authRepo.saveSession(session);

            return true;
        } catch (err) {
            throw new DomainServiceError('Failed to revoke session', { cause: err });
        }
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
     *
     * @throws {DomainServiceError} if authRepo throws error
     */
    async revokeAllSessionsForUser(userId: UserId): Promise<boolean> {
        try {
            const activeSessions = await this.authRepo.countActiveSessionsForUser(userId);

            if (!activeSessions) {
                return true;
            }

            const revokedSessions = await this.authRepo.revokeAllSessionsForUser(userId);

            if (activeSessions !== revokedSessions) {
                return false;
            }

            return true;
        } catch (err) {
            throw new DomainServiceError('Failed to revoked all sessions for user', { cause: err });
        }
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
        try {
            const session = await this.authRepo.findSessionById(sessionId);
            if (!session) {
                throw new DomainServiceError('Session not found');
            }

            const refreshTokenProps: RefreshTokenProps = {
                id: JwtTokenId.create(),
                sessionId: sessionId,
                token,
            };

            const newRefreshToken = RefreshToken.create(refreshTokenProps);

            session.rotateRefreshToken(newRefreshToken);

            await this.authRepo.saveSession(session);

            return newRefreshToken;
        } catch (err) {
            throw new DomainServiceError('Failed to rotate token', { cause: err });
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
        try {
            const session = await this.authRepo.findSessionByToken(refreshTokenId);

            if (!session || !session.active) {
                throw new DomainServiceError('Session not found or revoked');
            }

            const newRefreshToken = await this.rotateRefreshToken(refreshToken, session.id);

            const accessTokenProps: AccessTokenProps = {
                id: JwtTokenId.create(),
                token: accessToken,
                sessionId: session.id,
                userId: session.userId,
            };

            const newAccessToken = AccessToken.create(accessTokenProps);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new DomainServiceError('Failed to refresh session', { cause: err });
        }
    }

    /**
     * Retrieves a session by its ID.
     *
     * @param sessionId {SessionId} - The ID of the session to retrieve.
     *
     * @returns {Promise<Session | null>} A promise resolving to the session entity if found,
     *                                   or `null` if no session exists with the given ID.
     * @throw {DomainServiceError} if authRepo throws error
     */
    async getSessionById(sessionId: SessionId): Promise<Session | null> {
        try {
            const session = await this.authRepo.findSessionById(sessionId);

            if (!session) {
                return null;
            }

            return session;
        } catch (err) {
            throw new DomainServiceError('Failed to find session by id', { cause: err });
        }
    }

    /**
     * Retrieves all sessions associated with a given user.
     *
     * @param userId {UserId} - The ID of the user whose sessions to retrieve.
     *
     * @returns {Promise<SessionCollection | null>} A promise resolving to a SessionCollection if sessions are found,
     *                                              or `null` if no sessions exist for the user.
     * @throws {DomainServiceError} if authRepo throws error
     */
    async getAllSessionsForUser(userId: UserId): Promise<SessionCollection | null> {
        try {
            const sessions = await this.authRepo.findAllSessionsForUser(userId);

            if (sessions.count === 0) {
                return null;
            }

            return sessions;
        } catch (err) {
            throw new DomainServiceError('Failed to get all sessions for user', { cause: err });
        }
    }

    /**
     * Revokes all sessions that have expired.
     *
     * Domain rules enforced:
     * - Only sessions identified as expired are revoked.
     *
     * @returns {Promise<number>} A promise resolving to the number of sessions that were revoked.
     *
     * @throws {DomainServiceError} if authRepo throws error
     */
    async revokeExpiredSessions(): Promise<number> {
        try {
            const expiredSessions = await this.authRepo.findExpiredSessions();

            if (expiredSessions.count === 0) {
                return 0;
            }

            const revokedCount = expiredSessions.revokeExpired();

            await this.authRepo.saveSessions(expiredSessions);

            return revokedCount;
        } catch (err) {
            throw new DomainServiceError('Failed to revoke expired sessions', { cause: err });
        }
    }

    /**
     * Revokes all inactive sessions.
     *
     * Domain rules enforced:
     * - Only sessions marked as inactive are revoked.
     *
     * @returns {Promise<number>} A promise resolving to the number of inactive sessions that were revoked.
     *
     * @throws {DomainServiceError} if authRepo throws errror
     */
    async revokeInactiveSessions(): Promise<number> {
        try {
            const inactiveSessions = await this.authRepo.findInactiveSessions();

            if (inactiveSessions.count === 0) {
                return 0;
            }

            const inactiveCount = inactiveSessions.revokeInactive();

            await this.authRepo.saveSessions(inactiveSessions);

            return inactiveCount;
        } catch (err) {
            throw new DomainServiceError('Failed to revoke inactive sessions', { cause: err });
        }
    }
}
