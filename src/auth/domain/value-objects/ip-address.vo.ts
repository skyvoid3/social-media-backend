import { ValueObjectError } from 'src/common/domain/errors/value-object.error';
import { isIP } from 'net';

export class IpAddress {
    private constructor(private readonly val: string) {}

    public static create(val: string): IpAddress {
        if (!IpAddress.isValid(val)) {
            throw new ValueObjectError(`Invalid IP address`);
        }
        return new IpAddress(val);
    }

    private static isValid(val: string): boolean {
        return isIP(val) !== 0;
    }

    public isIPv4(): boolean {
        return isIP(this.val) === 4;
    }

    public isIPv6(): boolean {
        return isIP(this.val) === 6;
    }

    get value(): string {
        return this.val;
    }

    public equals(other: IpAddress): boolean {
        return this.val === other.val;
    }
}
