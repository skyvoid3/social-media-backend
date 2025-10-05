import { PostStatusEnum } from 'src/common/domain/enums/post-status.enum';

export class PostStatus {
    private constructor(private readonly val: PostStatusEnum) {}

    get value(): PostStatusEnum {
        return this.val;
    }

    static draft(): PostStatus {
        return new PostStatus(PostStatusEnum.Draft);
    }

    static published(): PostStatus {
        return new PostStatus(PostStatusEnum.Published);
    }

    static archived(): PostStatus {
        return new PostStatus(PostStatusEnum.Archived);
    }

    static deleted(): PostStatus {
        return new PostStatus(PostStatusEnum.Deleted);
    }

    isDeleted(): boolean {
        return this.val === PostStatusEnum.Deleted;
    }

    isDraft(): boolean {
        return this.val === PostStatusEnum.Draft;
    }

    isPublished(): boolean {
        return this.val === PostStatusEnum.Published;
    }

    isArchived(): boolean {
        return this.val === PostStatusEnum.Archived;
    }
}
