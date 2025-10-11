import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { PostId } from '../value-objects/post-id.vo';
import { Title } from '../value-objects/title.vo';
import { Content } from '../value-objects/content.vo';
import { PostTags } from '../value-objects/post-tags.vo';
import { PostStatus } from '../value-objects/post-status.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { PostProps, UpdatePostProps } from '../types';
import { EntityError } from 'src/common/domain/errors/entity.error';
import { PostMedia } from '../value-objects/post-media.vo';
import { MediaCollection } from '../value-objects/media-collection.vo';
import { Guard } from 'src/common/domain/utils/guard';
import { Counter } from 'src/common/domain/identity/value-objects/counter.vo';

/**
 * Post entity representing a domain aggregate for blog posts, articles, or social content.
 *
 * Responsibilities:
 *   - Maintains a unique identity (PostId).
 *   - Holds author identity (UserId) and core content fields (Title, Content).
 *   - Manages tags (PostTags), media (MediaCollection), and post status (PostStatus).
 *   - Tracks lifecycle timestamps (CreatedAt, UpdatedAt).
 *   - Encapsulates counters for likes, comments, and views (Counter VO).
 *
 * Domain invariants:
 *   - PostId and AuthorId are immutable after creation.
 *   - Counters cannot be negative.
 *   - Deleted posts cannot be modified (content, tags, media, status).
 *   - Updates to mutable fields automatically update UpdatedAt.
 *
 * Factories:
 *   - `create(props: PostProps)`: Creates a new Post instance with optional defaults.
 *   - `zero()` (Counter): Internal usage for likes, comments, and views.
 *
 * Status management:
 *   - `publish()`: Marks the post as published (if not deleted).
 *   - `unpublish()`: Reverts the post to draft (if not deleted).
 *   - `archive()`: Archives the post (if not deleted).
 *   - `delete()`: Marks the post as deleted.
 *   - Status methods enforce domain safety and prevent operations on deleted posts.
 *
 * Content and media management:
 *   - `update(props: UpdatePostProps)`: Updates title and/or content safely.
 *   - `addMedia(media: PostMedia)`: Adds media to the post.
 *   - `removeMedia(media: PostMedia)`: Removes media from the post.
 *   - All content/media changes trigger UpdatedAt update.
 *
 * Tag management:
 *   - `addTags(tags: string[])`: Adds tags to the post.
 *   - `removeTags(tags: string[])`: Removes tags from the post.
 *   - Tag modifications respect deleted-post invariants and update UpdatedAt.
 *
 * Counters (likes, comments, views):
 *   - `addLike(amount = 1)`: Increment likes by amount.
 *   - `removeLike(amount = 1)`: Decrement likes by amount.
 *   - `addComment(amount = 1)`: Increment comments by amount.
 *   - `removeComment(amount = 1)`: Decrement comments by amount.
 *   - `addView(amount = 1)`: Increment views by amount.
 *   - Counters enforce non-negative invariants and support batch updates.
 *
 * Internal mechanics:
 *   - `touch()`: Updates UpdatedAt timestamp whenever mutable state changes.
 *   - `ensureNotDeleted(message: string)`: Throws EntityError if post is deleted.
 *
 * Domain relationships:
 *   - Owns media (PostMedia) through MediaCollection VO.
 *   - Has multiple tags through PostTags VO.
 *   - Counters (likes, comments, views) are Value Objects ensuring consistency.
 *
 * Example lifecycle:
 *   1. Post is created via `create()`, optionally with default draft status.
 *   2. Content, media, and tags are added or updated.
 *   3. Post is published, archived, or deleted through status methods.
 *   4. Users interact with the post (likes, comments, views), updating counters safely.
 *   5. All mutable changes update UpdatedAt automatically.
 */
export class Post {
    private _id: PostId;
    private _authorId: UserId;
    private _title: Title;
    private _content: Content;
    private _tags: PostTags;
    private _status: PostStatus;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _media: MediaCollection;
    private _likesCount: Counter;
    private _commentsCount: Counter;
    private _viewsCount: Counter;

    /* Posts are always created with Draft status
     * Might be changed in the future
     */
    private constructor(props: PostProps) {
        this._id = props.id;
        this._authorId = props.authorId;
        this._title = props.title;
        this._content = props.content;
        this._tags = props.tags ?? PostTags.empty();
        this._status = props.status ?? PostStatus.draft();
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._media = props.media ?? MediaCollection.empty();
        this._likesCount = props.likesCount ?? Counter.zero();
        this._commentsCount = props.commentsCount ?? Counter.zero();
        this._viewsCount = props.viewsCount ?? Counter.zero();
    }

    public static create(props: PostProps): Post {
        return new Post(props);
    }

    /* Post status */

    public publish(): void {
        this.ensureNotDeleted('Cannot publish a deleted post');
        if (this._status.isPublished()) {
            return;
        }

        this._status = PostStatus.published();
        this.touch();
    }

    public unpublish(): void {
        this.ensureNotDeleted('Cannot unpublish a deleted post');

        if (this._status.isDraft()) {
            return;
        }

        this._status = PostStatus.draft();
        this.touch();
    }

    public archive(): void {
        this.ensureNotDeleted('Cannot archive a deleted post');

        if (this._status.isArchived()) {
            return;
        }

        this._status = PostStatus.archived();
        this.touch();
    }

    public delete(): void {
        if (this._status.isDeleted()) {
            return;
        }

        this._status = PostStatus.deleted();
        this.touch();
    }

    /* Content updates */

    public addMedia(media: PostMedia): void {
        this.ensureNotDeleted('Cannot add media to a deleted post');

        this._media = this._media.add(media);
        this.touch();
    }

    public removeMedia(media: PostMedia): void {
        this.ensureNotDeleted('Cannot remove media from a deleted post');

        this._media = this._media.remove(media);
        this.touch();
    }

    public update(props: UpdatePostProps): void {
        this.ensureNotDeleted('Cannot update a deleted post');

        if (Guard.isEmpty(props)) {
            return;
        }

        if (props.title) this._title = props.title;
        if (props.content) this._content = props.content;

        this.touch();
    }

    /* Tags */

    public addTags(tags: string[]): void {
        this.ensureNotDeleted('Cannot modify tags of a deleted post');

        this._tags = this._tags.add(tags);
        this.touch();
    }

    public removeTags(tags: string[]): void {
        this.ensureNotDeleted('Cannot modify tags of a deleted post');

        this._tags = this._tags.remove(tags);
        this.touch();
    }

    /* Likes, comments, views */

    public addLike(amount = 1): this {
        this._likesCount.incrementBy(amount);
        return this;
    }

    public removeLike(amount = 1): this {
        this._likesCount.decrementBy(amount);
        return this;
    }

    public addComment(amount = 1): this {
        // TODO: Add actual comment logic
        this._commentsCount.incrementBy(amount);
        return this;
    }

    public removeComment(amount = 1): this {
        // TODO: Add actual comment removing logic
        this._commentsCount.decrementBy(amount);
        return this;
    }

    public addView(amount = 1): this {
        this._viewsCount.incrementBy(amount);
        return this;
    }

    /* Private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    private ensureNotDeleted(message: string): void {
        if (this._status.isDeleted()) throw new EntityError(message);
    }

    /* Getters */

    get id(): PostId {
        return this._id;
    }

    get authorId(): UserId {
        return this._authorId;
    }

    get title(): Title {
        return this._title;
    }

    get content(): Content {
        return this._content;
    }

    get tags(): PostTags {
        return this._tags;
    }

    get status(): PostStatus {
        return this._status;
    }

    get createdAt(): CreatedAt {
        return this._createdAt;
    }

    get updatedAt(): UpdatedAt {
        return this._updatedAt;
    }

    get media(): PostMedia[] {
        return this._media.toArray();
    }
}
