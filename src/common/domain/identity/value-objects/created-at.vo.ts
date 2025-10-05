import { ValueObjectError } from '../../errors/value-object.error';
import { DateTime } from '../../utils/date-time';

export class CreatedAt {
    private constructor(private readonly val: DateTime) {}

    public static now(): CreatedAt {
        return new CreatedAt(DateTime.now());
    }

    // Create CreatedAt value object with existing DateTime object
    public static from(val: DateTime): CreatedAt {
        if (!(val instanceof DateTime) || isNaN(val.toMillis())) {
            throw new ValueObjectError('Invalid createdAt timestamp');
        }
        return new CreatedAt(val);
    }

    get time(): DateTime {
        return this.val;
    }

    public equals(other: CreatedAt): boolean {
        return this.val.toMillis() === other.val.toMillis();
    }
}
