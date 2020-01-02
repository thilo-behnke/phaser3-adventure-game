import { DynamicGameObject } from '../actors/DynamicGameObject';
import { Updatable } from '../shared/Updatable';
import { autoInjectable, injectable, singleton } from 'tsyringe';
import { UiComponent, UiInformation, UiMode, UiShape } from '../actors/UiComponent';
import Vector2 = Phaser.Math.Vector2;
import { Color, SCREEN_HEIGHT } from '../shared/constants';
import { sortBy, takeRight } from 'lodash';
import { ItemObject } from '../actors/items/ItemObject';

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

export type Event = BaseEvent & (AttackEvent | DamageEvent | ItemPickUpEvent | ItemUsedEvent);

@injectable()
export class EventRegistry implements Updatable, UiComponent {
    private loopCount = 0;
    private registry = new Array<Event>();

    update = (time: number, delta: number) => {
        this.loopCount++;
    };

    getId() {
        return 'EventRegistry';
    }

    register = (event: Event) => {
        this.registry.push({ ...event, loop: this.loopCount, ts: Date.now() });
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

    getUiInformation = () => {
        const pos = new Vector2(10, SCREEN_HEIGHT - 100);
        return [
            {
                type: UiShape.TEXT,
                info: {
                    pos: () => pos,
                    text: () => {
                        const lastFiveEvents = takeRight(this.registry, 5).map(this.eventToString);
                        return lastFiveEvents.join('\n');
                    },
                },
                mode: UiMode.ALL,
            },
        ] as UiInformation[];
    };

    private eventToString = (e: Event) => {
        switch (e.type) {
            case EventType.ATTACK:
                return `[${e.ts}] ${e.from.type} attacked ${e.to.type}.`;
            case EventType.DAMAGE_DEALT:
                return `[${e.ts}] ${e.to.type} received ${Math.abs(e.damage)} damage.`;
            case EventType.ITEM_PICKED_UP:
                return `[${e.ts}] ${e.by.type} picked up item ${e.item.type}.`;
            case EventType.ITEM_USED:
                return `[${e.ts}] Item ${e.item.type} used by ${e.by.type}.`;
        }
    };
}
