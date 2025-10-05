import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class UserId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): UserId {
        return new UserId();
    }
}
