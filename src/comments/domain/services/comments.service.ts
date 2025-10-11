import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { CommentProps } from '../types';
import { CommentId } from '../value-objects/comment-id.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { CommentsRepository } from '../contracts/comments.repository';
import { Content } from 'src/posts/domain/value-objects/content.vo';
import { Comment } from '../entities/comment.entity';
import { DomainServiceError } from 'src/common/domain/errors/domain-service.error';
import { CommentCollection } from '../value-objects/comment-collection.vo';
import { DEFAULT_PAGE_SIZE } from 'src/common/domain/constants';
import { Replies } from '../value-objects/replies.vo';

/**
 * Domain Layer Service — CommentsService
 *
 * The CommentsService coordinates Comment entities, value objects, and repository contracts
 * to implement comment-related business logic.
 *
 * Responsibilities include:
 *  - Creating comments and replies
 *  - Updating comment content
 *  - Deleting comments
 *  - Fetching comments for a given post
 *  - Fetching replies for a given comment
 *
 * This service operates purely within the domain layer and does not handle
 * transport, HTTP concerns, or persistence details directly.
 */
export class CommentsService {
    constructor(private readonly commentsRepo: CommentsRepository) {}

    /**
     * Creates a comment or a reply to an existing comment.
     *
     * @param authorId {UserId} - The ID of the user creating the comment.
     * @param postId {PostId} - The ID of the post where the parent comment exists.
     * @param content {Content} - The content of the reply.
     * @param [parentId] {CommentId} - Optional. The ID of the parent comment being replied to.
     *
     *
     * @returns {Promise<Comment>} The newly created reply comment entity.
     *
     * @throws {DomainServiceError} on fail
     */
    async createComment(
        authorId: UserId,
        postId: PostId,
        content: Content,
        parentId?: CommentId,
    ): Promise<Comment> {
        try {
            const props: CommentProps = {
                id: CommentId.create(),
                content,
                parentId,
                postId,
                authorId,
            };

            const comment = Comment.create(props);

            await this.commentsRepo.save(comment);

            return comment;
        } catch (err) {
            throw new DomainServiceError('Failed to create comment', { cause: err });
        }
    }

    /**
     * Deletes comment if it exists
     *
     * @param commentId {CommentId} - The ID of the comment to delete.
     * @returns {Promise<boolean>} Whether the deletion was successful.
     *
     * @throws {DomainServiceError} on fail
     */
    async deleteComment(commentId: CommentId): Promise<boolean> {
        try {
            const exists = await this.commentsRepo.existsById(commentId);

            if (!exists) {
                throw new DomainServiceError('Comment not found');
            }

            const deleted = await this.commentsRepo.delete(commentId);

            return deleted;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to delete comment', { cause: err });
        }
    }

    /**
     * @param commentId {CommentId} - The ID of the comment to update.
     * @returns {Promise<Comment>} The updated comment entity.
     */
    async updateComment(commentId: CommentId, content: Content): Promise<Comment> {
        try {
            const comment = await this.commentsRepo.findById(commentId);

            if (!comment) {
                throw new DomainServiceError('Comment not found');
            }

            comment.updateContent(content);

            await this.commentsRepo.save(comment);

            return comment;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to update comment', { cause: err });
        }
    }

    /**
     * Fetches a paginated collection of comments for a given post.
     *
     * Currently, pagination is handled using a simple `page` parameter,
     * and the page size is fixed via `DEFAULT_PAGE_SIZE`. This design may
     * be revised in the future to support more flexible pagination strategies
     * (e.g., cursor-based or dynamic page sizes).
     *
     * @param postId {PostId} - The ID of the post for which to fetch comments.
     * @param pagination {Object} - Optional pagination parameters.
     * @param pagination.page {number} - Optional page number (defaults to 1).
     *
     * @returns {Promise<CommentCollection>} A collection of comments belonging to the post.
     *
     * @throws {DomainServiceError} If the fetch operation fails.
     */
    async getCommentsByPost(
        postId: PostId,
        pagination: { page?: number } = {},
    ): Promise<CommentCollection> {
        try {
            const page = pagination.page ?? 1;
            const offset = (page - 1) * DEFAULT_PAGE_SIZE;
            const limit = DEFAULT_PAGE_SIZE;

            const comments = await this.commentsRepo.findByPost(postId, offset, limit);

            return comments;
        } catch (err) {
            throw new DomainServiceError('Failed to fetch comments by post', { cause: err });
        }
    }

    /**
     * Fetches all replies for a given comment.
     *
     * Currently, all replies are returned at once. Pagination or
     * other fetching strategies may be introduced in the future
     * if reply volumes become large.
     *
     * @param commentId {CommentId} - The ID of the comment for which to fetch replies.
     *
     * @returns {Promise<Replies>} A collection of replies belonging to the comment.
     *
     * @throws {DomainServiceError} If fetching replies fails.
     */
    async getReplies(commentId: CommentId): Promise<Replies> {
        try {
            const replies = await this.commentsRepo.findReplies(commentId);
            return replies;
        } catch (err) {
            throw new DomainServiceError('Failed to fetch replies for comment', { cause: err });
        }
    }
}
