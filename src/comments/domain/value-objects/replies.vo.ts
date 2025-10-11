import { EntityCollection } from 'src/common/domain/collections/entity.collection';
import { Comment } from '../entities/comment.entity';
import { ReplyId } from './reply-id.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';

/**
 * Domain collection representing all replies to a single Comment.
 *
 * Each Replies collection has a unique {@link ReplyId} to tie it to its parent comment.
 * Provides convenient domain-level operations for managing and querying replies.
 *
 * ## Notes
 * - Lifecycle is bound to the parent Comment aggregate.
 * - Immutability is preserved through {@link EntityCollection} base methods.
 */
export class Replies extends EntityCollection<Comment> {
    private constructor(
        /** Unique identifier for this Replies collection
         * It is created internally to avoid complexity
         */
        private readonly _id: ReplyId = ReplyId.create(),
        replies: Comment[] = [],
    ) {
        super(replies);
    }

    static empty(): Replies {
        return new Replies();
    }

    /** Returns the unique ID of this Replies collection. */
    get id(): ReplyId {
        return this._id;
    }

    /**
     * Finds all replies authored by a specific user.
     *
     * @param authorId - The ID of the reply author
     * @returns An array of Comment entities authored by the given user
     */
    findByAuthor(authorId: UserId): Comment[] {
        return this.getAll().filter((comment) => comment.authorId.equals(authorId));
    }

    /**
     * Returns the most recent replies up to the specified limit.
     *
     * @param limit - Maximum number of replies to return
     * @returns Array of recent Comment entities sorted newest first
     */
    findRecent(limit: number): Comment[] {
        return this.getAll()
            .sort((a, b) => b.createdAt.time.toMillis() - a.createdAt.time.toMillis())
            .slice(0, limit);
    }
}
