import { describe, it, expect } from 'vitest';
import { Username } from '../username.vo';
import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

describe('Username ValueObject', () => {
    it('should create a valid username', () => {
        const username = Username.create('john_doe');
        expect(username.value).toBe('john_doe');
        expect(username).toBeInstanceOf(Username);
    });

    it('should trim whitespace before validation and save trimmed string', () => {
        const username = Username.create('   alice   ');
        expect(username.value).toBe('alice');
    });

    it('should throw ValueObjectError if username is empty', () => {
        expect(() => Username.create('')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError if username is only spaces', () => {
        expect(() => Username.create('    ')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError if username contains invalid characters', () => {
        expect(() => Username.create('bad!name')).toThrow(ValueObjectError);
        expect(() => Username.create('john@doe')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError if username is too short or too long', () => {
        expect(() => Username.create('ab')).toThrow(ValueObjectError); // too short
        expect(() => Username.create('a'.repeat(51))).toThrow(ValueObjectError); // too long
    });

    it('should consider two identical usernames as equal', () => {
        const u1 = Username.create('john_doe');
        const u2 = Username.create('john_doe');
        expect(u1.equals(u2)).toBe(true);
    });

    it('should consider two different usernames as not equal', () => {
        const u1 = Username.create('john_doe');
        const u2 = Username.create('jane_doe');
        expect(u1.equals(u2)).toBe(false);
    });
});
