import { Email } from 'src/auth/domain/value-objects/email.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { User } from '../entities/user.entity';
import { UserCollection } from '../collections/user.collection';
import { PaginatedSearch } from 'src/common/domain/search-params/paginated-search.params';
import { FindAllUsersParams } from 'src/common/domain/search-params/find-all-users.params';

/**
 *  Repository contract for users domain
 *
 *  handles:
 *      - user CRUD
 */
export interface UsersRepository {
    findByIds(ids: UserId[]): Promise<UserCollection>;
    findByEmails(emails: Email[]): Promise<UserCollection>;
    findById(id: UserId): Promise<User | null>;
    findAll(pagination: PaginatedSearch, params: FindAllUsersParams): Promise<UserCollection>;
    findByEmail(email: Email): Promise<User | null>;
    existsById(id: UserId): Promise<boolean>;
    existsByEmail(email: Email): Promise<boolean>;
    existsByUsername(username: string): Promise<boolean>;
    save(user: User): Promise<User>;
    delete(userId: UserId): Promise<boolean>;
}
