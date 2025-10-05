import { UserId } from '../identity/value-objects/user-id.vo';

export class Like {
    private constructor(private readonly authorId: UserId) {}

    public static create(authorId: UserId): Like {
        return new Like(authorId);
    }

    get author(): UserId {
        return this.authorId;
    }

    public equals(other: Like): boolean {
        return this.authorId.equals(other.authorId);
    }
}
