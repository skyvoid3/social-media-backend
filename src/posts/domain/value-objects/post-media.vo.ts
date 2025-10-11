import { MediaType } from 'src/common/domain/enums/post-media-type.enum';
import { PostMediaAudioProps, PostMediaImageProps, PostMediaVideoProps } from '../types';
import { MediaURL } from 'src/common/domain/identity/value-objects/media-url.vo';
import { FileSize } from 'src/common/domain/identity/value-objects/file-size.vo';
import { Duration } from 'src/common/domain/identity/value-objects/duration.vo';

/**
 * Domain representation of a single media element (image, video, or audio)
 * attached to a Post aggregate.
 *
 * This value object encapsulates all metadata required to represent a piece
 * of media content in a consistent, validated, and immutable form.
 *
 * ## Responsibilities
 * - Enforces the valid combination of properties for each media type.
 * - Provides creation factories for type-safe instantiation (`createImage`, `createVideo`, `createAudio`).
 * - Exposes value object equality semantics (`equals`, `equalsDeep`).
 * - Encapsulates domain value objects: {@link MediaURL}, {@link FileSize}, and {@link Duration}.
 *
 * ## Media Type Constraints
 * - **Image:** has `url`, `FileSize.image`, no `duration`.
 * - **Video:** has `url`, `FileSize.video`, `duration`.
 * - **Audio:** has `url`, `FileSize.audio`, `duration`.
 *
 * ## Notes
 * - Instances are immutable and can only be created through static factory methods.
 * - Equality can be checked either shallowly (`equals`) or deeply (`equalsDeep`).
 * - Designed for use within the Post aggregate and related domain collections.
 */
export class PostMedia {
    private readonly _url: MediaURL;
    private readonly _type: MediaType;
    private readonly _size: FileSize;
    private readonly _duration: Duration | null;

    private constructor(url: MediaURL, type: MediaType, size: FileSize, duration: Duration | null) {
        this._url = url;
        this._type = type;
        this._size = size;
        this._duration = duration;
    }

    public static createAudio(props: PostMediaAudioProps): PostMedia {
        const size = FileSize.audio(props.size.value);
        return new PostMedia(props.url, MediaType.AUDIO, size, props.duration);
    }

    public static createVideo(props: PostMediaVideoProps): PostMedia {
        const size = FileSize.video(props.size.value);
        return new PostMedia(props.url, MediaType.VIDEO, size, props.duration);
    }

    public static createImage(props: PostMediaImageProps): PostMedia {
        const size = FileSize.image(props.size.value);
        return new PostMedia(props.url, MediaType.IMAGE, size, null);
    }

    get url(): MediaURL {
        return this._url;
    }

    get type(): MediaType {
        return this._type;
    }

    get size(): FileSize {
        return this._size;
    }

    get duration(): Duration | null {
        return this._duration;
    }

    /* Check uniqueness only based on URL */
    public equals(other: PostMedia): boolean {
        return this.url === other.url;
    }

    /* Check uniqueness based on every metadata */
    public equalsDeep(other: PostMedia): boolean {
        return (
            this._url.equals(other.url) &&
            this._type === other.type &&
            this._size.equals(other.size) &&
            ((this._duration && other.duration && this._duration.equals(other.duration)) ||
                this._duration === other.duration)
        );
    }

    public toJSON() {
        return {
            url: this._url.toString(),
            type: this._type,
            size: this._size.toJSON(),
            duration: this._duration?.toJSON() ?? null,
        };
    }

    public toString(): string {
        return `${this._type} -> ${this._url.toString()}`;
    }
}
