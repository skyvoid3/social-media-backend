import { describe, it, expect } from 'vitest';
import { IpAddress } from '../ip-address.vo';
import { ValueObjectError } from 'src/common/domain/errors/value-object.error';

describe('IpAddress Value Object', () => {
    it('should create a valid IPv4 address', () => {
        const ip = IpAddress.create('192.168.0.1');
        expect(ip.value).toBe('192.168.0.1');
        expect(ip.isIPv4()).toBe(true);
        expect(ip.isIPv6()).toBe(false);
    });

    it('should create a valid IPv6 address', () => {
        const ip = IpAddress.create('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
        expect(ip.value).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
        expect(ip.isIPv4()).toBe(false);
        expect(ip.isIPv6()).toBe(true);
    });

    it('should throw ValueObjectError for invalid IP', () => {
        expect(() => IpAddress.create('invalid-ip')).toThrowError(ValueObjectError);
        expect(() => IpAddress.create('')).toThrowError(ValueObjectError);
    });

    it('should correctly compare two IP addresses', () => {
        const ip1 = IpAddress.create('10.0.0.1');
        const ip2 = IpAddress.create('10.0.0.1');
        const ip3 = IpAddress.create('10.0.0.2');

        expect(ip1.equals(ip2)).toBe(true);
        expect(ip1.equals(ip3)).toBe(false);
    });
});
