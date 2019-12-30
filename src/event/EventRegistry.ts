import { DynamicGameObject } from '../actors/DynamicGameObject';
import { Updatable } from '../shared/Updatable';
import { singleton } from 'tsyringe';

export enum EventType {
    ATTACK = 'ATTACK',
    DAMAGE_DEALT = 'DAMAGE_DEALT',
}

export type Event =
    | { type: EventType.ATTACK; from: DynamicGameObject; to: DynamicGameObject }
    | {
          type: EventType.DAMAGE_DEALT;
          from: DynamicGameObject;
          to: DynamicGameObject;
          damage: number;
      };

@singleton()
export class EventRegistry implements Updatable {
    private loopCount = 0;
    private registry = new Map<number, Event[]>();

    update = (time: number, delta: number) => {
        this.loopCount++;
    };

    register = (event: Event) => {
        const events = this.registry.get(this.loopCount) || [];
        events.push(event);
        this.registry.set(this.loopCount, events);
    };

    wasAttackedLastLoop = (obj: DynamicGameObject) => {
        if (this.loopCount < 2) {
            return;
        }
        const loopEvents = this.registry.get(this.loopCount - 1) || [];
        return loopEvents
            .filter(({ type }) => type === EventType.ATTACK)
            .some(({ to }) => to.id === obj.id);
    };

    receivedDamageLastLoop = (obj: DynamicGameObject) => {
        if (this.loopCount < 2) {
            return;
        }
        const loopEvents = this.registry.get(this.loopCount - 1) || [];
        return loopEvents
            .filter(({ type }) => type === EventType.DAMAGE_DEALT)
            .some(({ to }) => to.id === obj.id);
    };
}
