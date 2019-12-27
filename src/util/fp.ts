export class Optional<T> {
    private readonly _value: T | null;

    private constructor(value: T | null) {
        this._value = value;
    }

    get value(): T | null {
        return this._value;
    }

    static of<S>(value: S) {
        if (value === null || value === undefined) {
            return new Optional(null);
        }
        return new Optional(value);
    }

    static empty<S>() {
        return new Optional<S>(null);
    }

    isEmpty(): boolean {
        return this._value === null;
    }

    ifPresent(callback: (T) => boolean) {
        return this._value !== null ? callback(this.value) : false;
    }
}

export const not = (pred: (...predArgs: any[]) => boolean) => (...args: any[]) => {
    return !pred(...args);
};
