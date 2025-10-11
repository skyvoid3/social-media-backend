import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class ReplyId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): ReplyId {
        return new ReplyId();
    }
}
