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
import { LikesCount } from '../value-objects/likes-count.vo';
import { CommentsCount } from '../value-objects/comments-count.vo';
import { ViewsCount } from '../value-objects/views-count.vo';

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
    private _likesCount: LikesCount;
    private _commentsCount: CommentsCount;
    private _viewsCount: ViewsCount;

    private constructor(props: PostProps) {
        this._id = props.id;
        this._authorId = props.authorId;
        this._title = props.title;
        this._content = props.content;
        this._tags = props.tags;
        this._status = props.status;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._media = props.media;
        this._likesCount = props.likesCount;
        this._commentsCount = props.commentsCount;
        this._viewsCount = props.viewsCount;
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
    }

    /* Likes, comments, views */

    public addLike(): void {
        this._likesCount.increment();
    }

    public removeLike(): void {
        this._likesCount.decrement();
    }

    public addComment(): void {
        // TODO: Make Actual comment adding logic
        this._commentsCount.increment();
    }

    public removeComment(): void {
        //TODO: Make actual comment removing logic
        this._commentsCount.decrement();
    }

    public addView(): void {
        this._viewsCount.increment();
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
        return this._media.getAll();
    }
}
