import { Identifiable } from '../identity/identifiable';
import { UUIDV4 } from '../identity/value-objects/uuid.vo';

export abstract class EntityCollection<T extends Identifiable> {
    protected readonly items: Map<string, T> = new Map();

    protected constructor(initialItems: T[] = []) {
        initialItems.forEach((item) => this.items.set(item.id.value, item));
    }

    add(entity: T): void {
        const key = entity.id.value;
        if (this.items.has(key)) {
            throw new Error(`Entity with id ${key} already exists`);
        }
        this.items.set(key, entity);
    }

    remove(entityId: UUIDV4): void {
        this.items.delete(entityId.value);
    }

    getById(entityId: UUIDV4): T | undefined {
        return this.items.get(entityId.value);
    }

    has(entityId: UUIDV4): boolean {
        return this.items.has(entityId.value);
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }

    count(): number {
        return this.items.size;
    }
}
