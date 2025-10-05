import { describe, it, expect } from 'vitest';
import { Password } from '../password.vo';
import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

describe('Password ValueObject', () => {
    it('should create a valid password', () => {
        const password = Password.create('StrongPass123!');
        expect(password.value).toBe('StrongPass123!');
    });

    it('should throw ValueObjectError for empty password', () => {
        expect(() => Password.create('')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError for whitespace-only password', () => {
        expect(() => Password.create('   ')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError for invalid format (too short, missing symbols, etc.)', () => {
        expect(() => Password.create('weak')).toThrow(ValueObjectError);
    });

    it('should consider two identical passwords equal', () => {
        const p1 = Password.create('StrongPass123!');
        const p2 = Password.create('StrongPass123!');
        expect(p1.equals(p2)).toBe(true);
    });

    it('should consider two different passwords not equal', () => {
        const p1 = Password.create('StrongPass123!');
        const p2 = Password.create('AnotherPass456!');
        expect(p1.equals(p2)).toBe(false);
    });
});
