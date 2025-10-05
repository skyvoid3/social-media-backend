import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class SessionId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): SessionId {
        return new SessionId();
    }
}
