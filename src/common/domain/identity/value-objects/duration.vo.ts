export class Duration {
    private constructor(private readonly seconds: number) {
        if (!Number.isFinite(seconds) || seconds < 0) {
            throw new Error(`Duration must be a non-negative number of seconds, got: ${seconds}`);
        }
    }

    public static fromSeconds(seconds: number): Duration {
        return new Duration(seconds);
    }

    public static fromMinutes(minutes: number): Duration {
        return new Duration(minutes * 60);
    }

    public static fromHours(hours: number): Duration {
        return new Duration(hours * 3600);
    }

    public getSeconds(): number {
        return this.seconds;
    }

    public getMinutes(): number {
        return this.seconds / 60;
    }

    public getHours(): number {
        return this.seconds / 3600;
    }

    public equals(other: Duration): boolean {
        return this.seconds === other.seconds;
    }

    public toString(): string {
        return `${this.seconds} seconds`;
    }

    public toJSON(): number {
        return this.seconds;
    }
}
