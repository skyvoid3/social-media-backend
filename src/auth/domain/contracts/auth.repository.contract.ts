import { JwtToken } from '../value-objects/token.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Session } from 'src/auth/domain/entities/session.entity';
import { SessionCollection } from '../collections/session.collection';

/**
 *  Repository contract for auth domain
 *
 *  handles:
 *   - multi-session token CRUD
 */
export interface AuthRepository {
    saveSession(session: Session): Promise<void>;
    revokeSession(session: Session): Promise<void>;
    revokeAllSessionsForUser(userId: UserId): Promise<void>;
    findSessionByToken(token: JwtToken): Promise<Session | null>;
    findAllSessionsForUser(userId: UserId): Promise<SessionCollection>;
}
