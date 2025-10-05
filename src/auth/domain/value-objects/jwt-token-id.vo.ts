import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

export class JwtTokenId extends UUIDV4 {
    private constructor() {
        super();
    }

    public static create(): JwtTokenId {
        return new JwtTokenId();
    }
}
