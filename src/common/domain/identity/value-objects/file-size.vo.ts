import {
    MAX_AUDIO_BYTES,
    MAX_IMAGE_BYTES,
    MAX_VIDEO_BYTES,
} from '../../constants/media-size.constants';
import { ValueObjectError } from '../../errors/value-object.error';

export class FileSize {
    private constructor(private readonly val: number) {
        if (!Number.isInteger(val) || val < 0) {
            throw new ValueObjectError(`FileSize must be a non-negative integer, got: ${val}`);
        }
    }
    public static fromBytes(bytes: number): FileSize {
        return new FileSize(bytes);
    }

    public static fromKB(kb: number): FileSize {
        return new FileSize(Math.round(kb * 1024));
    }

    public static fromMB(mb: number): FileSize {
        return new FileSize(Math.round(mb * 1024 * 1024));
    }

    public static audio(bytes: number): FileSize {
        if (bytes > MAX_AUDIO_BYTES) {
            throw new ValueObjectError(`Audio too large. Max allowed ${MAX_AUDIO_BYTES} bytes`);
        }

        return new FileSize(bytes);
    }

    public static image(bytes: number): FileSize {
        if (bytes > MAX_IMAGE_BYTES) {
            throw new ValueObjectError(`Image too large. Max allowed ${MAX_IMAGE_BYTES} bytes`);
        }

        return new FileSize(bytes);
    }

    public static video(bytes: number): FileSize {
        if (bytes > MAX_VIDEO_BYTES) {
            throw new ValueObjectError(`Video too large. Max allowed ${MAX_VIDEO_BYTES} bytes`);
        }

        return new FileSize(bytes);
    }

    get value(): number {
        return this.val;
    }

    public toKB(): number {
        return this.val / 1024;
    }

    public toMB(): number {
        return this.val / 1024 / 1024;
    }

    public equals(other: FileSize): boolean {
        return this.val === other.val;
    }

    public toString(): string {
        return `${this.val} bytes`;
    }

    public toJSON(): number {
        return this.val;
    }
}
