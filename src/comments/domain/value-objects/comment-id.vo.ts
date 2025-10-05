import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class CommentId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): CommentId {
        return new CommentId();
    }
}
