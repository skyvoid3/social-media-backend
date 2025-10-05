import { describe, it, expect } from 'vitest';
import { UserAgent } from '../user-agent.vo';
import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

describe('UserAgent ValueObject', () => {
    it('should create a valid UserAgent', () => {
        const ua = UserAgent.create('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        expect(ua.value).toBe('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        expect(ua).toBeInstanceOf(UserAgent);
    });

    it('should throw ValueObjectError if empty string', () => {
        expect(() => UserAgent.create('')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError if not a string', () => {
        // @ts-expect-error intentional wrong type
        expect(() => UserAgent.create(12345)).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError if length exceeds 500 characters', () => {
        const tooLong = 'a'.repeat(501);
        expect(() => UserAgent.create(tooLong)).toThrow(ValueObjectError);
    });

    it('should consider two equal UserAgents as equal', () => {
        const ua1 = UserAgent.create('Mozilla/5.0');
        const ua2 = UserAgent.create('Mozilla/5.0');
        expect(ua1.equals(ua2)).toBe(true);
    });

    it('should consider different UserAgents as not equal', () => {
        const ua1 = UserAgent.create('Mozilla/5.0');
        const ua2 = UserAgent.create('Chrome/120.0');
        expect(ua1.equals(ua2)).toBe(false);
    });
});
