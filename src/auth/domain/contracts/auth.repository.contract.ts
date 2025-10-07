import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Session } from 'src/auth/domain/entities/session.entity';
import { SessionCollection } from '../collections/session.collection';
import { SessionId } from '../value-objects/session-id.vo';
import { JwtTokenId } from '../value-objects/jwt-token-id.vo';

/**
 *  Repository contract for auth domain
 *
 *  handles:
 *   - multi-session token CRUD
 */
export interface AuthRepository {
    saveSession(session: Session): Promise<void>;
    saveSessions(sessions: SessionCollection): Promise<void>;
    revokeSession(id: SessionId): Promise<void>;
    revokeAllSessionsForUser(id: UserId): Promise<number>;
    countActiveSessionsForUser(id: UserId): Promise<number>;
    findSessionByToken(id: JwtTokenId): Promise<Session | null>;
    findSessionById(id: SessionId): Promise<Session | null>;
    findAllSessionsForUser(id: UserId): Promise<SessionCollection>;
    findExpiredSessions(): Promise<SessionCollection>;
    findInactiveSessions(): Promise<SessionCollection>;
}
