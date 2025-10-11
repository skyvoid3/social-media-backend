import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Post } from '../entities/post.entity';
import { PostId } from '../value-objects/post-id.vo';
import { PostTags } from '../value-objects/post-tags.vo';
import { PostCollection } from '../collections/post.collection';
import { PaginatedSearch } from 'src/common/domain/search-params/paginated-search.params';

/**
 *  Repository contract for posts domain
 *
 *  handles:
 *      - posts CRUD
 */
export interface PostsRepository {
    save(post: Post): Promise<Post>;
    delete(id: PostId): Promise<boolean>;
    existsById(postId: PostId): Promise<boolean>;
    findById(id: PostId): Promise<Post>;
    findByIds(ids: PostId[]): Promise<PostCollection>;
    findByUserIds(userIds: UserId[]): Promise<PostCollection>;
    findAllByUser(userId: UserId, params: PaginatedSearch): Promise<PostCollection>;
    findAll(params: PaginatedSearch): Promise<PostCollection>;
    findByTags(tags: PostTags, params: PaginatedSearch): Promise<PostCollection>;
}
