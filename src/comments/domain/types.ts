import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { CommentId } from './value-objects/comment-id.vo';
import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { Content } from 'src/posts/domain/value-objects/content.vo';
import { PostId } from 'src/posts/domain/value-objects/post-id.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';

export interface CommentProps {
    id: CommentId;
    createdAt: CreatedAt;
    updatedAt: UpdatedAt;
    authorId: UserId;
    content: Content;
    parentId?: CommentId;
    postId: PostId;
}
