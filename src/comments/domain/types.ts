import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { CommentId } from './value-objects/comment-id.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Content } from 'src/posts/domain/value-objects/content.vo';
import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { Counter } from 'src/common/domain/identity/value-objects/counter.vo';

/* Common property interfaces for creating entities, valube objects*/

/* Properties used in Comment Entity factory*/
export interface CommentProps {
    id: CommentId;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    authorId: UserId;
    content: Content;
    parentId?: CommentId;
    postId: PostId;
    likesCount?: Counter;
}
