import { UserId } from 'src/common/domain/identity/value-objects/user-id.vo';
import { PostId } from './value-objects/post-id.vo';
import { Title } from './value-objects/title.vo';
import { Content } from './value-objects/content.vo';
import { PostTags } from './value-objects/post-tags.vo';
import { PostStatus } from './value-objects/post-status.vo';
import { CreatedAt } from 'src/common/domain/identity/value-objects/created-at.vo';
import { UpdatedAt } from 'src/common/domain/identity/value-objects/updated-at.vo';
import { MediaURL } from 'src/common/domain/identity/value-objects/media-url.vo';
import { MediaType } from 'src/common/domain/enums/post-media-type.enum';
import { FileSize } from 'src/common/domain/identity/value-objects/file-size.vo';
import { Duration } from 'src/common/domain/identity/value-objects/duration.vo';
import { MediaCollection } from './value-objects/media-collection.vo';
import { LikesCount } from './value-objects/likes-count.vo';
import { CommentsCount } from './value-objects/comments-count.vo';
import { ViewsCount } from './value-objects/views-count.vo';

/* Helper props for filling entity factories */

export interface PostProps {
    id: PostId;
    authorId: UserId;
    title: Title;
    content: Content;
    tags: PostTags;
    status: PostStatus;
    createdAt?: CreatedAt;
    updatedAt?: UpdatedAt;
    media: MediaCollection;
    likesCount: LikesCount;
    commentsCount: CommentsCount;
    viewsCount: ViewsCount;
}

export interface UpdatePostProps {
    title?: Title;
    content?: Content;
}

export interface PostMediaAudioProps {
    url: MediaURL;
    type: MediaType.AUDIO;
    size: FileSize;
    duration: Duration;
}

export interface PostMediaVideoProps {
    url: MediaURL;
    type: MediaType.VIDEO;
    size: FileSize;
    duration: Duration;
}

export interface PostMediaImageProps {
    url: MediaURL;
    type: MediaType.IMAGE;
    size: FileSize;
}
