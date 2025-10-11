import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Comment } from '../entities/comment.entity';
import { CommentId } from '../value-objects/comment-id.vo';
import { CommentCollection } from '../value-objects/comment-collection.vo';
import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { Replies } from '../value-objects/replies.vo';

/**
 *  Repository contract for comments domain
 *
 *  handles:
 *      - comments CRUD
 */
export interface CommentsRepository {
    save(comment: Comment): Promise<Comment>;
    delete(id: CommentId): Promise<boolean>;
    findById(id: CommentId): Promise<Comment | null>;
    findByUser(userId: UserId, offset: number, limit: number): Promise<CommentCollection>;
    findByPost(postId: PostId, offset: number, limit: number): Promise<CommentCollection>;
    findReplies(parentId: CommentId): Promise<Replies>;
    existsById(commentId: CommentId): Promise<boolean>;
}
