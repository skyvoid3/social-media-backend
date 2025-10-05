import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class PostId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): PostId {
        return new PostId();
    }
}
