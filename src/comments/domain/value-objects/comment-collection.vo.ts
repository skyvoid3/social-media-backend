import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';
import { Comment } from '../entities/comment.entity';
import { EntityCollection } from 'src/common/domain/collections/entity.collection';

/**
 * Domain collection representing a set of {@link Comment} entities
 * associated with a single Post aggregate.
 *
 * Provides query utilities for common domain operations such as
 * filtering by author or retrieving the most recent comments.
 *
 * ## Performance
 * - All methods operate in O(n) time complexity.
 *   This is acceptable for typical comment counts, but
 *   may require redesign if performance becomes a bottleneck.
 *
 * ## Notes
 * - Used within the Post aggregate root to manage related comments.
 * - Inherits base behaviors (add, remove, getById) from {@link EntityCollection}.
 */
export class CommentCollection extends EntityCollection<Comment> {
    /**
     * Returns all comments authored by the given user.
     *
     * @param authorId - The unique identifier of the author.
     * @returns An array of {@link Comment} entities.
     */
    findByAuthor(authorId: UUIDV4): Comment[] {
        return this.getAll().filter((comment) => comment.authorId.equals(authorId));
    }

    /**
     * Returns the most recent comments up to the specified limit.
     *
     * @param limit - Maximum number of comments to return.
     * @returns An array of recent {@link Comment} entities, sorted by creation time (newest first).
     */
    findRecent(limit: number): Comment[] {
        return this.getAll()
            .sort((a, b) => b.createdAt.time.toMillis() - a.createdAt.time.toMillis())
            .slice(0, limit);
    }

    /**
     * Returns an empty instance of the collection.
     *
     * Useful for initializing or resetting the collection in a domain-safe way.
     */
    static empty(): CommentCollection {
        return new CommentCollection();
    }
}
