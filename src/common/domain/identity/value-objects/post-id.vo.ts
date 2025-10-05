import { ValueObjectError } from '../../errors/value-object.error';

export class PostId {
    private constructor(private readonly value: string) {}

    public static create(value: string): PostId {
        if (!value || value.trim() === '') {
            throw new ValueObjectError('Post Id cannot be empty');
        }

        return new PostId(value);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: PostId): boolean {
        return this.value === other.value;
    }
}
