import { PostMedia } from '../value-objects/post-media.vo';
import { ValueObjectCollection } from 'src/common/domain/collections/value-object.collection';
import { MediaType } from 'src/common/domain/enums/post-media-type.enum';

export class MediaCollection extends ValueObjectCollection<PostMedia> {
    protected equals(a: PostMedia, b: PostMedia): boolean {
        return a.equals(b);
    }

    protected clone(items: PostMedia[]): this {
        return new MediaCollection(items) as this;
    }

    findImages(): PostMedia[] {
        return this.toArray.filter((m) => m.type === MediaType.IMAGE);
    }

    findVideos(): PostMedia[] {
        return this.toArray.filter((m) => m.type === MediaType.VIDEO);
    }

    findAudio(): PostMedia[] {
        return this.toArray.filter((m) => m.type === MediaType.AUDIO);
    }
}
