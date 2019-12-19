import { BaseGameObject } from './BaseGameObject';
import { CollisionGroupDef } from '../collision/CollisionGroupDef';
import { CollisionGroup, CollisionType } from '../collision/CollisionGroup';
import { DynamicGameObject } from './DynamicGameObject';
import { MonsterStateMachine } from './state/monster/MonsterStateMachine';
import { IMonsterStateMachine } from './state/monster/IMonsterStateMachine';
import Vector2 = Phaser.Math.Vector2;

export enum MonsterType {
    WOLF = 'WOLF',
    SHEEP = 'SHEEP',
}

export const NUMBER_OF_MONSTERS = Object.keys(MonsterType).length;

export type MonsterStats = {
    // Fight stats.
    health: number;
    strength: number;
    agility: number;
    // Other.
    attentionRadius: number;
};

@CollisionGroupDef(CollisionGroup.PLAYER, CollisionType.COLLIDE)
export class MonsterObject extends DynamicGameObject {
    private _hp: number;
    protected _type: MonsterType;
    private stats: MonsterStats;

    protected stateMachine: IMonsterStateMachine;

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

    onAddToScene = (): void => {
        this.sprite.setMaxVelocity(50, 50);
        this.stateMachine = new MonsterStateMachine(this);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        this.stateMachine.update(delta, this);
        return;
    };

    accelerateTowards = (pos: Vector2): void => {
        const dir = pos.subtract(this.sprite.getCenter());
        this.sprite.setAcceleration(dir.x, dir.y);
    };

    getStats = (): MonsterStats => this.stats;

    onDeath = (): void => {
        return;
    };

    playIdleAnim = (): void => {
        console.log('play idle anim');
    };

    playWalkingAnim = (): void => {
        console.log('play walking anim');
    };
}
