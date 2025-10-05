import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Comment } from '../entities/comment.entity';
import { CommentId } from '../value-objects/comment-id.vo';
import { CommentCollection } from '../value-objects/comment-collection.vo';
import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { PaginatedSearchParams } from 'src/common/domain/search-params/paginated-search.params';

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
    findByUser(userId: UserId, params: PaginatedSearchParams): Promise<CommentCollection>;
    findByPost(postId: PostId, params: PaginatedSearchParams): Promise<CommentCollection>;
}
