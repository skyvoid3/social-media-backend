import { ValueObjectError } from '../errors/value-object.error';

export abstract class ValueObjectCollection<T> {
    protected constructor(protected readonly items: T[] = []) {}

    add(item: T): this {
        if (this.items.some((i) => this.equals(i, item))) {
            throw new ValueObjectError('Duplicate item');
        }
        return this.clone([...this.items, item]);
    }

    remove(item: T): this {
        return this.clone(this.items.filter((i) => !this.equals(i, item)));
    }

    get toArray(): T[] {
        return [...this.items];
    }

    count(): number {
        return this.items.length;
    }

    protected abstract equals(a: T, b: T): boolean;
    protected abstract clone(items: T[]): this;
}
