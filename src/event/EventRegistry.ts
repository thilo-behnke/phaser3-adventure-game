import { DynamicGameObject } from '../actors/DynamicGameObject';
import { Updatable } from '../shared/Updatable';
import { singleton } from 'tsyringe';
import { UiComponent, UiInformation, UiMode, UiShape } from '../actors/UiComponent';
import Vector2 = Phaser.Math.Vector2;
import { Color, SCREEN_HEIGHT } from '../shared/constants';
import { sortBy, takeRight } from 'lodash';

export enum EventType {
    ATTACK = 'ATTACK',
    DAMAGE_DEALT = 'DAMAGE_DEALT',
}

export type Event =
    | {
          type: EventType.ATTACK;
          loop?: number;
          ts?: number;
          from: DynamicGameObject;
          to: DynamicGameObject;
      }
    | {
          type: EventType.DAMAGE_DEALT;
          loop?: number;
          ts?: number;
          from: DynamicGameObject;
          to: DynamicGameObject;
          damage: number;
      };

@singleton()
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
            .some(({ to }) => to.id === obj.id);
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
            .some(({ to }) => to.id === obj.id);
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
                return `${e.from.id} attacked ${e.to.id}.`;
            case EventType.DAMAGE_DEALT:
                return `${e.to.id} received ${Math.abs(e.damage)} damage.`;
        }
    };
}
