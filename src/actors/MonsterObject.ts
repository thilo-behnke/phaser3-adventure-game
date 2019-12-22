import { CollisionGroupDef } from '../collision/CollisionGroupDef';
import { CollisionGroup, CollisionType } from '../collision/CollisionGroup';
import { DynamicGameObject } from './DynamicGameObject';
import { MonsterStateMachine } from './state/monster/MonsterStateMachine';
import { IMonsterStateMachine } from './state/monster/IMonsterStateMachine';
import { Debuggable, DebugInformation, DebugShape } from './Debuggable';
import { Color } from '../shared/constants';
import { FollowingState } from './state/monster/FollowingState';
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
export class MonsterObject extends DynamicGameObject implements Debuggable {
    private _hp: number;
    protected _type: MonsterType;
    private stats: MonsterStats;

    private _attentionRadius: number;

    protected stateMachine: IMonsterStateMachine;

    constructor(id: string, stats: MonsterStats, type: MonsterType) {
        super(id);
        this._type = type;
        this.stats = stats;
        this._attentionRadius = stats.attentionRadius;
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

    get attentionRadius(): number {
        return this._attentionRadius;
    }

    set attentionRadius(value: number) {
        this._attentionRadius = value;
    }

    onAddToScene = (): void => {
        this.sprite.setMaxVelocity(50, 50);
        this.stateMachine = new MonsterStateMachine(this);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (time: number): void => {
        this.stateMachine.update(time, this);
        return;
    };

    accelerateTowards = (pos: Vector2): void => {
        const dir = pos
            .clone()
            .subtract(this.sprite.getCenter())
            .normalize();
        const angleBetweenCurrentAndNewDir = Math.acos(
            this.sprite.body.velocity
                .clone()
                .normalize()
                .dot(dir.clone())
        );
        // Increase the acceleration towards the goal if the the current direction is far away.
        const newAcc = angleBetweenCurrentAndNewDir >= 0.5 ? dir.scale(100) : dir.scale(50);
        // TODO: It would be better to accelerate here instead of directly setting the velocity, however this looks/feels weird.
        this.sprite.setVelocity(newAcc.x, newAcc.y);
    };

    break = () => {
        this.sprite.setVelocity(0, 0);
    };

    get baseStats() {
        return this.stats;
    }

    onDeath = (): void => {
        return;
    };

    playIdleAnim = (): void => {
        console.log('play idle anim');
    };

    playWalkingAnim = (): void => {
        console.log('play walking anim');
    };

    drawDebugInformation = (): DebugInformation[] => {
        return [
            [
                DebugShape.CIRCLE,
                {
                    center: () => this.sprite.getCenter(),
                    radius: () => this._attentionRadius,
                    color: () =>
                        this.stateMachine.currentState instanceof FollowingState
                            ? Color.RED
                            : Color.BLACK,
                    alpha: () => 0.2,
                },
            ],
            [
                DebugShape.VECTOR,
                {
                    start: () => this.sprite.getCenter(),
                    end: () => this.stateMachine.isMovingTowardsPos() || this.sprite.getCenter(),
                },
            ],
        ];
    };
}
