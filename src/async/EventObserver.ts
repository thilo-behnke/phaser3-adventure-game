import { Observer } from './Observer';
import { GameEvent, EventRegistry } from '../event/EventRegistry';
import { generateUUID } from '../util/random';
import { autoInjectable, injectable } from 'tsyringe';

@injectable()
export class EventObserver implements Observer<GameEvent[]> {
    private receiveFunc: (data: GameEvent[]) => void;

    constructor(private eventRegistry: EventRegistry) {
        this.eventRegistry.register(this);
    }
    onReceive = (func: (data: GameEvent[]) => void) => {
        this.receiveFunc = func;
        return this;
    };
    getId = () => {
        return 'EventObserver--' + generateUUID();
    };
    receive = (data: GameEvent[]) => {
        this.receiveFunc(data);
    };
    shutdown = () => {
        this.eventRegistry.unregister(this);
    };
}
