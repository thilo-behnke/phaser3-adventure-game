import { Observer } from './Observer';

export abstract class Subject<T> {
    protected observers: { [key: string]: Observer<T> } = {};

    register = (observer: Observer<T>) => {
        if (!this.observers[observer.getId()]) {
            this.observers[observer.getId()] = observer;
        }
    };
    unregister = (observer: Observer<T>) => {
        if (!this.observers[observer.getId()]) {
            delete this.observers[observer.getId()];
        }
    };
    notifyObservers = (data: T) => {
        Object.values(this.observers).forEach(observer => observer.receive(data));
    };
}
