import { ValueObjectError } from '../../errors/value-object.error';
import { DateTime } from '../../utils/date-time';

export class UpdatedAt {
    private constructor(private readonly value: DateTime) {}

    public static now(): UpdatedAt {
        return new UpdatedAt(DateTime.now());
    }

    public static from(value: DateTime): UpdatedAt {
        if (!(value instanceof DateTime) || isNaN(value.toMillis())) {
            throw new ValueObjectError('Invalid UpdatedAt timestamp');
        }

        return new UpdatedAt(value);
    }

    public getValue(): DateTime {
        return this.value;
    }

    public equals(other: UpdatedAt): boolean {
        return this.value === other.value;
    }
}
