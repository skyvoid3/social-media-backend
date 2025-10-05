import { EntityCollection } from 'src/common/domain/collections/entity.collection';
import { Session } from 'src/auth/domain/entities/session.entity';
import { IpAddress } from '../value-objects/ip-address.vo';
import { UserAgent } from '../value-objects/user-agent.vo';

/* The lookups are O(n). But this is not an issue because a user can have only 5 sessions
 * better design will be in the future
 *
 *
 * User can have maximum 5 sessions at the same time. Later this number can be changed
 */
export class SessionCollection extends EntityCollection<Session> {
    sortByRecent(): Session[] {
        return this.getAll().sort(
            (a, b) => b.createdAt.time.toMillis() - a.createdAt.time.toMillis(),
        );
    }

    public static create(sessions: Session[]): SessionCollection {
        return new SessionCollection(sessions);
    }

    /* Returns most recently created session */
    get mostRecent(): Session {
        return this.sortByRecent()[0];
    }

    /* Returns only the active sessions for a user */
    get active(): Session[] {
        return this.getAll().filter((s) => s.revoked === false);
    }

    /* Returns number of active sessions of a user */
    get activeCount(): number {
        return this.active.length;
    }

    getbyIP(ip: IpAddress): Session[] {
        return this.getAll().filter((s) => s.ipAddress === ip);
    }

    getByUserAgent(ua: UserAgent): Session[] {
        return this.getAll().filter((s) => s.userAgent === ua);
    }
}
