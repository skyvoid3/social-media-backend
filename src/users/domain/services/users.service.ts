import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { UsersRepository } from '../contracts/user-repository.contract';
import { User } from '../entities/user.entity';
import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Username } from 'src/auth/domain/value-objects/username.vo';
import { Password } from 'src/auth/domain/value-objects/password.vo';
import { UserProps } from '../types';
import { DomainServiceError } from 'src/common/domain/errors/domain-service.error';

/**
 * Domain Layer Service — UsersService
 *
 * The UsersService coordinates domain entities, value objects, and repository contracts
 * to implement user-related business logic.
 *
 * Responsibilities include:
 *  - Creating users
 *  - Updating user profiles (email, password, etc.)
 *  - Deactivating users
 *  - Deleting users
 *  - Enforcing uniqueness of email and username
 *
 * This service operates purely within the domain layer and does not handle
 * transport, HTTP concerns, or persistence details directly.
 */
export class UsersService {
    constructor(private readonly usersRepo: UsersRepository) {}

    /**
     * Creates a new user within the domain.
     *
     * Domain rules enforced:
     * - A new unique `UserId` is generated for every user.
     * - The user must have valid `Username`, `Email`, and `Password` value objects.
     * - The resulting `User` entity is persisted through the `usersRepo`.
     *
     * @param {Username} username - The username value object representing the user's chosen name.
     * @param {Email} email - The email value object representing the user's email address.
     * @param {Password} password - The password value object representing the user's securely hashed password.
     *
     * @returns {Promise<User>} A promise resolving to the newly created and persisted `User` entity.
     *
     * @throws {DomainServiceError} If the user creation or persistence fails (e.g., repository or validation errors).
     */
    async createUser(username: Username, email: Email, password: Password): Promise<User> {
        try {
            const userProps: UserProps = {
                id: UserId.create(),
                username,
                email,
                password,
            };

            const newUser = User.create(userProps);

            const user = await this.usersRepo.save(newUser);

            return user;
        } catch (err) {
            throw new DomainServiceError('Failed to create user', { cause: err });
        }
    }

    /**
     * Deletes an existing user from the system.
     *
     * Domain rules enforced:
     * - The user must exist before deletion can occur.
     * - If the user does not exist, a domain error is raised instead of performing a no-op.
     *
     * @param {UserId} userId - The unique identifier of the user to be deleted.
     *
     * @returns {Promise<boolean>} A promise resolving to `true` if the user was successfully deleted,
     * or `false` if the deletion did not complete as expected.
     *
     * @throws {DomainServiceError} If the user is not found or if the repository operation fails.
     */
    async deleteUser(userId: UserId): Promise<boolean> {
        try {
            const userExists = await this.usersRepo.existsById(userId);

            if (!userExists) {
                throw new DomainServiceError('User not found');
            }

            const deleted = await this.usersRepo.delete(userId);

            return deleted;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to create user', { cause: err });
        }
    }

    /**
     * Updates the email address of an existing user.
     *
     * Domain rules enforced:
     * - The user must exist before the email can be updated.
     * - The new email must be a valid Email value object.
     * - Email update occurs through the User entity to preserve invariants.
     *
     * @param userId {UserId} - The identifier of the user to update.
     * @param newEmail {Email} - The new email address as a value object.
     *
     * @returns {Promise<User>} A promise resolving to the updated User entity.
     *
     * @throws {DomainServiceError} If the user is not found or persistence fails.
     */
    async updateEmail(userId: UserId, newEmail: Email): Promise<User> {
        try {
            const user = await this.usersRepo.findById(userId);

            if (!user) {
                throw new DomainServiceError('User not found');
            }

            user.updateEmail(newEmail);

            await this.usersRepo.save(user);

            return user;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to update user email', { cause: err });
        }
    }

    /**
     * Updates the username of an existing user.
     *
     * Domain rules enforced:
     * - The user must exist before the username can be updated.
     * - The new username must be a valid Username value object.
     * - Username update occurs through the User entity to preserve invariants.
     *
     * @param userId {UserId} - The identifier of the user to update.
     * @param newUsername {Username} - The new username as a value object.
     *
     * @returns {Promise<User>} A promise resolving to the updated User entity.
     *
     * @throws {DomainServiceError} If the user is not found or persistence fails.
     */
    async updateUsername(userId: UserId, newUsername: Username): Promise<User> {
        try {
            const user = await this.usersRepo.findById(userId);

            if (!user) {
                throw new DomainServiceError('User not found');
            }

            user.updateUsername(newUsername);

            await this.usersRepo.save(user);

            return user;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to update user username', { cause: err });
        }
    }

    /**
     * Updates the password of an existing user.
     *
     * Domain rules enforced:
     * - The user must exist before the password can be updated.
     * - The new password must be a valid Password value object.
     * - Password update occurs through the User entity to preserve invariants.
     *
     * @param userId {UserId} - The identifier of the user to update.
     * @param newPassword {Password} - The new password as a value object.
     *
     * @returns {Promise<User>} A promise resolving to the updated User entity.
     *
     * @throws {DomainServiceError} If the user is not found or persistence fails.
     */
    async updatePassword(userId: UserId, newPassword: Password): Promise<User> {
        try {
            const user = await this.usersRepo.findById(userId);

            if (!user) {
                throw new DomainServiceError('User not found');
            }

            user.updatePassword(newPassword);

            await this.usersRepo.save(user);

            return user;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to update user password', { cause: err });
        }
    }
}
