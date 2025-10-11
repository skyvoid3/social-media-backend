import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { CommentId } from '../value-objects/comment-id.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Content } from 'src/posts/domain/value-objects/content.vo';
import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { CommentProps } from '../types';
import { Counter } from 'src/common/domain/identity/value-objects/counter.vo';
import { Replies } from '../value-objects/replies.vo';

/**
 * Domain entity representing a Comment within a Post.
 *
 * Encapsulates all behavior related to a comment:
 * - Likes management
 * - Content updates
 * - Reply management
 *
 * Uses value objects for IDs, timestamps, counters, and content.
 */
export class Comment {
    private _postId: PostId;
    private _id: CommentId;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _authorId: UserId;
    private _likesCount: Counter;
    private _content: Content;
    private _parentId?: CommentId;
    private _replies: Replies;

    private constructor(props: CommentProps) {
        this._postId = props.postId;
        this._id = props.id;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._authorId = props.authorId;
        this._likesCount = props.likesCount ?? Counter.zero();
        this._content = props.content;
        this._parentId = props.parentId;
        this._replies = Replies.empty();
    }

    /**
     * Factory method to create a new Comment entity.
     */
    public static create(props: CommentProps): Comment {
        return new Comment(props);
    }

    /** Increments the comment's like counter. */
    public addLike(): void {
        this._likesCount.increment();
    }

    /** Decrements the comment's like counter. */
    public removeLike(): void {
        this._likesCount.decrement();
    }

    /**
     * Updates the content of the comment and refreshes the updatedAt timestamp.
     */
    public updateContent(newContent: Content): void {
        this._content = newContent;
        this.touch();
    }

    /* replies*/

    /** Adds a reply to this comment. */
    public addReply(reply: Comment): void {
        this._replies.add(reply);
    }

    /** Removes a reply from this comment by its ID. */
    public removeReply(replyId: CommentId): void {
        this._replies.remove(replyId);
    }

    /* private helpers*/

    /** Updates the updatedAt timestamp to the current time. */
    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* getters */

    get postId(): PostId {
        return this._postId;
    }

    get id(): CommentId {
        return this._id;
    }

    get createdAt(): CreatedAt {
        return this._createdAt;
    }

    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get authorId(): UserId {
        return this._authorId;
    }

    get likesCount(): Counter {
        return this._likesCount;
    }

    get content(): Content {
        return this._content;
    }

    get parentId(): CommentId | undefined {
        return this._parentId;
    }

    get replies(): Replies {
        return this._replies;
    }
}
