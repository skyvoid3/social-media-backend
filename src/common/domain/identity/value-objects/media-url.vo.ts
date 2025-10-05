import { ValueObjectError } from '../../errors/value-object.error';
import { MEDIA_URL_REGEX } from '../regex';

export class MediaURL {
    private constructor(private readonly value: string) {}

    public static create(value: string): MediaURL {
        if (!value.trim() || !MediaURL.isValid(value)) {
            throw new ValueObjectError('Invalid url format');
        }

        return new MediaURL(value);
    }

    public static isValid(value: string): boolean {
        return MEDIA_URL_REGEX.test(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: MediaURL): boolean {
        return this.value === other.value;
    }

    public isHostedOn(domain: string): boolean {
        try {
            const parsedUrl = new URL(this.value);
            return parsedUrl.hostname === domain;
        } catch {
            return false;
        }
    }

    public getHostname(): string | null {
        try {
            return new URL(this.value).hostname;
        } catch {
            return null;
        }
    }

    public toString(): string {
        return this.value;
    }
}
