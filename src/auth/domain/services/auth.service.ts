import { AuthRepository } from '../contracts/auth.repository.contract';
import { Session } from '../entities/session.entity';
import { RefreshTokenFactory } from '../factories/refresh-token.factory';
import { SessionFactory } from '../factories/session.factory';
import { CreateRefreshTokenParams, CreateSessionParams } from '../params';
import { SessionId } from '../value-objects/session-id.vo';

export class AuthService {
    /* Dependency Injection. */
    constructor(private readonly authRepo: AuthRepository) {}

    /*
     * Creates new session.
     * SessionId generation is handled in this service. Because it needs to be shared by
     * refreshToken and Session. On the other hand the refreshToken id is created internally
     */
    async createSession(
        sessionParams: CreateSessionParams,
        tokenParams: CreateRefreshTokenParams,
    ): Promise<Session> {
        const sessionId = SessionId.create();

        const refreshToken = RefreshTokenFactory.createNew(tokenParams, sessionId);

        const session = SessionFactory.createNew(sessionParams, refreshToken, sessionId);

        await this.authRepo.saveSession(session);

        return session;
    }

    async revokeSession() {}
    async revokeAllSessionsForUser() {}
    async rotateRefreshToken() {}
    // What is this?
    async refreshSession() {}

    async getSessionById() {}
    async getAllSessionsForUser() {}
    async validateRefreshToken() {}

    // You sure this should be here?
    async validateAccessToken() {}

    async revokeExpiredSessions() {}
    async revokeInactiveSessions() {}

    // Why would I even need this?
    async rotateAllRefreshTokensForUser() {}
}
