import { BaseGameObject } from './BaseGameObject';
import { CollisionGroupDef } from '../collision/CollisionGroupDef';
import { CollisionGroup, CollisionType } from '../collision/CollisionGroup';

export enum MonsterType {
    WOLF = 'WOLF',
    SHEEP = 'SHEEP',
}

export const NUMBER_OF_MONSTERS = Object.keys(MonsterType).length;

export type MonsterStats = {
    health: number;
    strength: number;
    agility: number;
};

@CollisionGroupDef(CollisionGroup.PLAYER, CollisionType.COLLIDE)
export class MonsterObject extends BaseGameObject {
    private _hp: number;
    protected _type: MonsterType;
    private stats: MonsterStats;

    constructor(id: string, stats: MonsterStats, type: MonsterType) {
        super(id);
        this._type = type;
        this.stats = stats;
    }

    get hp(): number {
        return this._hp;
    }

    set hp(value: number) {
        // Don't allow hp below 0 or above max hp.
        const correctedHp = Math.max(0, Math.min(value, this.stats.health));
        if (correctedHp === 0) {
            this.onDeath();
        }
        this._hp = correctedHp;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        return;
    };

    getStats = (): MonsterStats => this.stats;

    onDeath = (): void => {
        return;
    };
}
