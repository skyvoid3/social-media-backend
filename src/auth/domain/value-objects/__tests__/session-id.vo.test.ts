import { describe, it, expect } from 'vitest';
import { SessionId } from '../session-id.vo';
import { UUIDV4 } from 'src/common/domain/identity/value-objects/uuid.vo';

describe('SessionId ValueObject', () => {
    it('should create a valid SessionId instance', () => {
        const sessionId = SessionId.create();
        expect(sessionId).toBeInstanceOf(SessionId);
        expect(sessionId).toBeInstanceOf(UUIDV4);
        expect(sessionId.value).toBeTypeOf('string');
        expect(sessionId.value).not.toBe('');
    });

    it('should generate unique IDs', () => {
        const id1 = SessionId.create().value;
        const id2 = SessionId.create().value;
        expect(id1).not.toBe(id2);
    });
});
