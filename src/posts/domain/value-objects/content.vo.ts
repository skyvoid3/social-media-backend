export class Content {
    private constructor(private readonly val: string) {}

    static create(val: string): Content {
        return new Content(val);
    }

    get value(): string {
        return this.val;
    }
}
