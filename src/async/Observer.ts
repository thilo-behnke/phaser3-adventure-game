export interface Observer<T> {
    getId: () => string;
    receive: (data: T) => void;
    shutdown: () => void;
}
