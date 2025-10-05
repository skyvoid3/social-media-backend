import { describe, it, expect } from 'vitest';
import { JwtTokenId } from '../jwt-token-id.vo';

describe('JwtTokenId ValueObject', () => {
    it('should create an instance of JwtTokenId', () => {
        const tokenId = JwtTokenId.create();
        expect(tokenId).toBeInstanceOf(JwtTokenId);
    });

    it('should have a value property', () => {
        const tokenId = JwtTokenId.create();
        expect(typeof tokenId.value).toBe('string');
        expect(tokenId.value.length).toBeGreaterThan(0);
    });

    it('should produce unique values for different instances', () => {
        const id1 = JwtTokenId.create();
        const id2 = JwtTokenId.create();
        expect(id1.value).not.toBe(id2.value);
    });
});
