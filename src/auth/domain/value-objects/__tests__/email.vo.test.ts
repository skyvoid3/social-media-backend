import { describe, it, expect } from 'vitest';
import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { Email } from '../email.vo';

describe('Email ValueObject', () => {
    it('should create a valid email', () => {
        const email = Email.create('test@example.com');
        expect(email).toBeInstanceOf(Email);
        expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace and still create valid email', () => {
        const email = Email.create('   test@example.com  ');
        expect(email.value).toBe('test@example.com');
    });

    it('should throw an error for empty string', () => {
        expect(() => Email.create('')).toThrowError(ValueObjectError);
    });

    it('should throw an error for invalid email format', () => {
        expect(() => Email.create('invalid-email')).toThrowError(ValueObjectError);
        expect(() => Email.create('no-at-symbol.com')).toThrowError(ValueObjectError);
        expect(() => Email.create('no-domain@')).toThrowError(ValueObjectError);
    });

    it('should correctly compare two emails', () => {
        const email1 = Email.create('user@example.com');
        const email2 = Email.create('user@example.com');
        const email3 = Email.create('other@example.com');

        expect(email1.equals(email2)).toBe(true);
        expect(email1.equals(email3)).toBe(false);
    });
});
