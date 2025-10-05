import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Password } from 'src/auth/domain/value-objects/password.vo';
import { Username } from 'src/auth/domain/value-objects/username.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { UserProps } from '../types';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { Session } from '../../../auth/domain/entities/session.entity';
import { SessionId } from 'src/auth/domain/value-objects/session-id.vo';
import { RefreshToken } from 'src/auth/domain/entities/refresh-token.entity';
import { MediaURL } from 'src/common/domain/identity/value-objects/media-url.vo';
import { SessionCollection } from 'src/auth/domain/collections/session.collection';

export class User {
    private _id: UserId;
    private _email: Email;
    private _username: Username;
    private _password: Password;
    private _avatar?: MediaURL;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _sessions: Map<string, Session>;

    private constructor(props: UserProps) {
        this._id = props.id;
        this._email = props.email;
        this._username = props.username;
        this._password = props.password;
        this._avatar = props.avatar;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        /* Converting sessions array to a map for faster operations */
        this._sessions = props.sessions
            ? new Map<string, Session>(props.sessions.map((s) => [s.id.value, s]))
            : new Map<string, Session>();
    }

    static create(props: UserProps) {
        return new User(props);
    }

    /* session managment */

    addSession(session: Session): this {
        this._sessions.set(session.id.value, session);
        return this;
    }

    removeSession(sessionId: SessionId): this {
        this._sessions.delete(sessionId.value);
        return this;
    }

    getSession(sessionId: SessionId): Session | undefined {
        return this._sessions.get(sessionId.value);
    }

    revokeSession(sessionId: SessionId): this {
        const session = this._sessions.get(sessionId.value);
        if (session) session.revoke();
        return this;
    }

    rotateSessionToken(sessionId: SessionId, newToken: RefreshToken): this {
        const session = this._sessions.get(sessionId.value);
        if (session) session.rotateRefreshToken(newToken);
        return this;
    }

    revokeAllSessions(): this {
        this._sessions.forEach((session) => session.revoke());
        return this;
    }

    revokeOtherSessions(currentSessionId: SessionId): this {
        this._sessions.forEach((session) => {
            if (session.id.value !== currentSessionId.value) {
                session.revoke();
            }
        });
        return this;
    }

    /* updates */

    updateUsername(newUsername: Username) {
        this._username = newUsername;
        this.touch();
        return this;
    }

    updateEmail(newEmail: Email) {
        this._email = newEmail;
        this.touch();
        return this;
    }

    updateAvatar(newAvatar: MediaURL) {
        this._avatar = newAvatar;
        this.touch();
        return this;
    }

    updatePassword(newPassword: Password) {
        this._password = newPassword;
        this.touch();
        return this;
    }

    /* private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* getters */

    get id(): UserId {
        return this._id;
    }
    get email(): Email {
        return this._email;
    }
    get username(): Username {
        return this._username;
    }
    get password(): Password {
        return this._password;
    }
    get avatar(): MediaURL | undefined {
        return this._avatar;
    }
    get createdAt(): CreatedAt {
        return this._createdAt;
    }
    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get sessions(): SessionCollection {
        return SessionCollection.create(Array.from(this._sessions.values()));
    }

    /* Converts sessions into array and passes it to the factory of SessionCollection class */
    get activeSessions(): SessionCollection {
        return SessionCollection.create(
            Array.from(this._sessions.values()).filter((s) => !s.revoked),
        );
    }
}
