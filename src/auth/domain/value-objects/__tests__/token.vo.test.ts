import { describe, it, expect } from 'vitest';
import { JwtToken } from '../token.vo';
import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

describe('JwtToken ValueObject', () => {
    it('should create a valid JwtToken', () => {
        const validToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
            'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.' +
            'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
        const token = JwtToken.create(validToken);
        expect(token.value).toBe(validToken);
        expect(token).toBeInstanceOf(JwtToken);
    });

    it('should throw ValueObjectError for empty string', () => {
        expect(() => JwtToken.create('')).toThrow(ValueObjectError);
    });

    it('should throw ValueObjectError for invalid token format', () => {
        expect(() => JwtToken.create('invalid-token')).toThrow(ValueObjectError);
    });

    it('should trim whitespace before validating and save trimmed string', () => {
        const validToken =
            '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
            'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvZSIsImlhdCI6MTUxNjIzOTAyMn0.' +
            'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ  ';
        const token = JwtToken.create(validToken);
        expect(token.value.trim()).toBe(validToken.trim());
    });

    it('should consider two tokens equal if their values match', () => {
        const tokenString =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
            'eyJzdWIiOiIxMjM0NTY3ODkwIn0.' +
            'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
        const token1 = JwtToken.create(tokenString);
        const token2 = JwtToken.create(tokenString);
        expect(token1.equals(token2)).toBe(true);
    });

    it('should return false for non-equal tokens', () => {
        const token1 = JwtToken.create(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxfQ.sig',
        );
        const token2 = JwtToken.create(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxfQ.sig',
        );
        expect(token1.equals(token2)).toBe(false);
    });
});
