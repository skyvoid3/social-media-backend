import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class CounterId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): CounterId {
        return new CounterId();
    }
}
