import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

/**
 * Domain value object representing a Post title.
 *
 * Ensures basic validation and normalization
 * for title text within the domain layer.
 */
export class Title {
    private constructor(private readonly val: string) {}

    static create(val: string): Title {
        const trimmed = val.trim();

        if (!trimmed || trimmed.length > 255) throw new ValueObjectError('Invalid title');
        return new Title(trimmed);
    }

    get value(): string {
        return this.val;
    }
}
