import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';
import { Comment } from '../entities/comment.entity';
import { EntityCollection } from 'src/common/domain/collections/entity.collection';

/* The class methods are in O(n). When this becomes a bottleneck
 * a new design will be implemented
 */
export class CommentCollection extends EntityCollection<Comment> {
    findByAuthor(authorId: UUIDV4): Comment[] {
        return this.getAll().filter((comment) => comment.authorId.equals(authorId));
    }

    findRecent(limit: number): Comment[] {
        return this.getAll()
            .sort((a, b) => b.createdAt.time.toMillis() - a.createdAt.time.toMillis())
            .slice(0, limit);
    }
}
