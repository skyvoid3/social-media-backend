import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { CommentId } from '../value-objects/comment-id.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { LikesCount } from 'src/posts/domain/value-objects/likes-count.vo';
import { Content } from 'src/posts/domain/value-objects/content.vo';
import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { CommentCollection } from '../value-objects/comment-collection.vo';
import { CommentProps } from '../types';

export class Comment {
    private _postId: PostId;
    private _id: CommentId;
    private _createdAt: CreatedAt;
    private _updatedAt: UpdatedAt;
    private _authorId: UserId;
    private _likesCount: LikesCount;
    private _content: Content;
    private _parentId?: CommentId;
    private _replies: CommentCollection = CommentCollection.create();

    private constructor(props: CommentProps) {
        this._postId = props.postId;
        this._id = props.id;
        this._createdAt = props.createdAt ?? CreatedAt.now();
        this._updatedAt = props.updatedAt ?? UpdatedAt.now();
        this._authorId = props.authorId;
        this._likesCount = LikesCount.zero();
        this._content = props.content;
        this._parentId = props.parentId;
    }

    public static create(props: CommentProps): Comment {
        return new Comment(props);
    }

    /* Likes */

    public addLike(): void {
        this._likesCount.increment();
    }

    public removeLike(): void {
        this._likesCount.decrement();
    }

    /* Updates */

    public updateContent(newContent: Content): void {
        this._content = newContent;
        this.touch();
    }

    /* Replies */
    public addReply(reply: Comment): void {
        this._replies = this._replies.add(reply);
    }

    public removeReply(replyId: CommentId): void {
        this._replies = this._replies.remove(replyId);
    }

    /* Private helpers */

    private touch(): void {
        this._updatedAt = UpdatedAt.now();
    }

    /* Getters */
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

    get likesCount(): LikesCount {
        return this._likesCount;
    }

    get content(): Content {
        return this._content;
    }

    get parentId(): CommentId | undefined {
        return this._parentId;
    }

    get replies(): CommentCollection {
        return this._replies;
    }
}
