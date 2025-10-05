import { ArrayHelper } from 'src/common/domain/utils/array-helper';

export class PostTags {
    private constructor(private readonly val: string[]) {}

    static create(tags: string[]): PostTags {
        return new PostTags(ArrayHelper.findUnique(tags));
    }

    public add(tags: string[]): PostTags {
        return PostTags.create(ArrayHelper.merge(this.val, tags));
    }

    public remove(tags: string[]): PostTags {
        return PostTags.create(ArrayHelper.remove(this.val, tags));
    }

    get value(): string[] {
        return this.val;
    }
}
