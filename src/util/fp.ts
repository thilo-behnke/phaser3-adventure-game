export class Optional<T> {
    private readonly _value: T | null;

    private constructor(value: T | null) {
        this._value = value;
    }

    get value(): T | null {
        return this._value;
    }

    static of<S>(value: S) {
        return new Optional(value);
    }

    static empty<S>() {
        return new Optional<S>(null);
    }

    isEmpty(): boolean {
        return this._value === null;
    }
}
