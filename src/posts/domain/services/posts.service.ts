import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { DomainServiceError } from 'src/common/domain/errors/domain-service.error';
import { PostsRepository } from '../contracts/posts-repository.contract';
import { Title } from '../value-objects/title.vo';
import { Content } from '../value-objects/content.vo';
import { Post } from '../entities/post.entity';
import { PostProps } from '../types';
import { PostId } from '../value-objects/post-id.vo';

/**
 * Domain Layer Service — PostsService
 *
 * The PostsService coordinates Post entities, value objects, and repository contracts
 * to implement post-related business logic.
 *
 * Responsibilities include:
 * - Creating draft posts for authors.
 * - Editing draft posts while enforcing draft-only rules.
 * - Updating post content for allowed post states (draft or published, excluding archived/deleted).
 *
 * This service operates purely within the domain layer and does not handle
 * transport, HTTP concerns, or persistence details directly.
 */
export class PostsService {
    /* Dependency Injection*/
    constructor(private readonly postsRepo: PostsRepository) {}

    /**
     * Creates a new draft post for a given author.
     *
     * Domain rules enforced:
     * - The post is created in draft status by default.
     * - All default counters (likes, comments, views) are initialized to zero.
     * - Tags and media collections are initialized as empty if not provided.
     *
     * @param authorId {UserId} - The author of the post.
     * @param title {Title} - The title of the post.
     * @param content {Content} - The main content of the post.
     *
     * @returns {Promise<Post>} A promise resolving to the newly created Post entity in draft status.
     *
     * @throws {DomainServiceError} If the post creation or repository save fails.
     */
    async createDraft(authorId: UserId, title: Title, content: Content): Promise<Post> {
        try {
            const postProps: PostProps = {
                id: PostId.create(),
                authorId,
                title,
                content,
            };
            const post = Post.create(postProps);

            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            throw new DomainServiceError('Failed to create new post', { cause: err });
        }
    }

    /**
     * Updates the title and/or content of a draft post.
     *
     * Domain rules enforced:
     * - Only posts with Draft status can be edited via this method.
     * - Archived, published, or deleted posts cannot be edited with this method.
     *
     * @param postId {PostId} - The unique identifier of the post to edit.
     * @param title {Title} - Optional new title for the post.
     * @param content {Content} - Optional new content for the post.
     *
     * @returns {Promise<Post>} A promise resolving to the updated Post entity.
     *
     * @throws {DomainServiceError} If the post is not found, is not a draft, or if the repository save fails.
     */
    async editDraft(postId: PostId, title?: Title, content?: Content): Promise<Post> {
        try {
            const post = await this.postsRepo.findById(postId);

            if (!post) {
                throw new DomainServiceError('Post not found');
            }

            if (!post.status.isDraft()) {
                throw new DomainServiceError('Can edit only draft post');
            }

            post.update({ title, content });

            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to update draft', { cause: err });
        }
    }

    /**
     * Updates the title and/or content of a post, excluding archived or deleted posts.
     *
     * Domain rules enforced:
     * - Draft and published posts can be edited.
     * - Archived or deleted posts cannot be modified.
     *
     * @param postId {PostId} - The unique identifier of the post to edit.
     * @param title {Title} - The new title for the post.
     * @param content {Content} - The new content for the post.
     *
     * @returns {Promise<Post>} A promise resolving to the updated Post entity.
     *
     * @throws {DomainServiceError} If the post is not found, is archived/deleted, or if the repository save fails.
     */
    async editContent(postId: PostId, title: Title, content: Content): Promise<Post> {
        try {
            const post = await this.postsRepo.findById(postId);

            if (!post) {
                throw new DomainServiceError('Post not found');
            }

            if (post.status.isArchived() || post.status.isDeleted()) {
                throw new DomainServiceError('Cannot edit archived or deleted post');
            }

            post.update({ title, content });

            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to update post content', { cause: err });
        }
    }

    /**
     * Deletes a post by marking it as deleted.
     *
     * Domain rules enforced:
     * - Only posts that exist can be deleted.
     * - Deletion marks the post status as Deleted.
     * - Orchestrates any additional domain-level rules if needed (e.g., cascading events or counters).
     *
     * @param postId {PostId} - The unique identifier of the post to delete.
     *
     * @returns {Promise<Post>} A promise resolving to the deleted Post entity.
     *
     * @throws {DomainServiceError} If the post is not found or if the repository save fails.
     */
    async deletePost(postId: PostId): Promise<Post> {
        try {
            const post = await this.postsRepo.findById(postId);

            if (!post) {
                throw new DomainServiceError('Post not found');
            }

            post.delete();

            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            if (err instanceof DomainServiceError) throw err;
            throw new DomainServiceError('Failed to delete post', { cause: err });
        }
    }

    /**
     * Publishes a post by changing its status to Published.
     *
     * Domain rules enforced:
     * - Only existing posts can be published.
     * - Deleted posts cannot be published (enforced at entity level).
     *
     * @param postId {PostId} - The unique identifier of the post to publish.
     *
     * @returns {Promise<Post>} A promise resolving to the published Post entity.
     *
     * @throws {DomainServiceError} If the post is not found or if the repository save fails.
     */
    async publishPost(postId: PostId): Promise<Post> {
        try {
            const post = await this.postsRepo.findById(postId);
            if (!post) throw new DomainServiceError('Post not found');

            post.publish();
            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            throw new DomainServiceError('Failed to publish post', { cause: err });
        }
    }

    /**
     * Unpublishes a post by changing its status to Draft.
     *
     * Domain rules enforced:
     * - Only existing posts can be unpublished.
     * - Deleted posts cannot be unpublished (enforced at entity level).
     *
     * @param postId {PostId} - The unique identifier of the post to unpublish.
     *
     * @returns {Promise<Post>} A promise resolving to the unpublished Post entity.
     *
     * @throws {DomainServiceError} If the post is not found or if the repository save fails.
     */
    async unpublishPost(postId: PostId): Promise<Post> {
        try {
            const post = await this.postsRepo.findById(postId);
            if (!post) throw new DomainServiceError('Post not found');

            post.unpublish();
            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            throw new DomainServiceError('Failed to unpublish post', { cause: err });
        }
    }

    /**
     * Archives a post by changing its status to Archived.
     *
     * Domain rules enforced:
     * - Only existing posts can be archived.
     * - Deleted posts cannot be archived (enforced at entity level).
     *
     * @param postId {PostId} - The unique identifier of the post to archive.
     *
     * @returns {Promise<Post>} A promise resolving to the archived Post entity.
     *
     * @throws {DomainServiceError} If the post is not found or if the repository save fails.
     */
    async archivePost(postId: PostId): Promise<Post> {
        try {
            const post = await this.postsRepo.findById(postId);
            if (!post) throw new DomainServiceError('Post not found');

            post.archive();
            await this.postsRepo.save(post);

            return post;
        } catch (err) {
            throw new DomainServiceError('Failed to archive post', { cause: err });
        }
    }
}
