import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

export class UserAgent {
    private constructor(private readonly val: string) {}

    public static create(val: string): UserAgent {
        if (!val || typeof val !== 'string' || val.length > 500) {
            throw new ValueObjectError('Invalid UserAgent format');
        }
        return new UserAgent(val);
    }

    get value(): string {
        return this.val;
    }

    public equals(other: UserAgent): boolean {
        return this.val === other.val;
    }
}
