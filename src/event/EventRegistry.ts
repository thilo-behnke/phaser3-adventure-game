import { DynamicGameObject } from '../actors/DynamicGameObject';
import { Updatable } from '../shared/Updatable';
import { autoInjectable, injectable, singleton } from 'tsyringe';
import { UiComponent, UiInformation, UiMode, UiShape } from '../actors/UiComponent';
import Vector2 = Phaser.Math.Vector2;
import { Color, SCREEN_HEIGHT } from '../shared/constants';
import { sortBy, takeRight } from 'lodash';
import { ItemObject } from '../actors/items/ItemObject';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { Subject } from '../async/Subject';
import { Observer } from '../async/Observer';

export enum EventType {
    ATTACK = 'ATTACK',
    DAMAGE_DEALT = 'DAMAGE_DEALT',
    ITEM_PICKED_UP = 'ITEM_PICKED_UP',
    ITEM_USED = 'ITEM_USED',
}

type BaseEvent = {
    type: EventType;
    loop?: number;
    ts?: number;
};

type AttackEvent = {
    type: EventType.ATTACK;
    from: DynamicGameObject;
    to: DynamicGameObject;
};
type DamageEvent = {
    type: EventType.DAMAGE_DEALT;
    from: DynamicGameObject;
    to: DynamicGameObject;
    damage: number;
};

type ItemPickUpEvent = {
    type: EventType.ITEM_PICKED_UP;
    by: DynamicGameObject;
    item: ItemObject;
};

type ItemUsedEvent = {
    type: EventType.ITEM_USED;
    by: DynamicGameObject;
    item: ItemObject;
};

export type GameEvent = BaseEvent & (AttackEvent | DamageEvent | ItemPickUpEvent | ItemUsedEvent);

@injectable()
export class EventRegistry extends Subject<GameEvent[]> implements Updatable {
    private loopCount = 0;
    private registry: Array<GameEvent> = [];
    private subject = new BehaviorSubject(this.registry);

    update = (time: number, delta: number) => {
        this.loopCount++;
    };

    sendEvent = (event: GameEvent) => {
        this.registry.push({ ...event, loop: this.loopCount, ts: Date.now() });
        this.notifyObservers(this.registry);
    };

    wasAttackedLastLoop = (obj: DynamicGameObject) => {
        if (this.loopCount < 2) {
            return;
        }
        return this.registry
            .filter(({ loop, type }) => loop === this.loopCount - 1 && type === EventType.ATTACK)
            .some((event: AttackEvent) => event.to.id === obj.id);
    };

    // TODO: Generalize.
    receivedDamageLastLoop = (obj: DynamicGameObject) => {
        if (this.loopCount < 2) {
            return;
        }
        return this.registry
            .filter(
                ({ loop, type }) => loop === this.loopCount - 1 && type === EventType.DAMAGE_DEALT
            )
            .some((event: DamageEvent) => event.to.id === obj.id);
    };
}
