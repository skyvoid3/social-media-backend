import { EntityCollection } from 'src/common/domain/collections/entity.collection';
import { User } from '../entities/user.entity';

export class UserCollection extends EntityCollection<User> {
    private _byEmail: Map<string, User>;
    private _byUsername: Map<string, User>;

    private constructor(users: User[]) {
        super(users);

        this._byEmail = new Map(users.map((u) => [u.email.value, u]));
        this._byUsername = new Map(users.map((u) => [u.username.value, u]));
    }

    public static create(users: User[]): UserCollection {
        return new UserCollection(users);
    }

    public getByEmail(email: string): User | undefined {
        return this._byEmail.get(email);
    }

    public getByUsername(username: string): User | undefined {
        return this._byUsername.get(username);
    }

    public hasEmail(email: string): boolean {
        return this._byEmail.has(email);
    }

    public hasUsername(username: string): boolean {
        return this._byUsername.has(username);
    }
}
