import { CollisionGroupDef } from '../collision/CollisionGroupDef';
import { CollisionGroup, CollisionType } from '../collision/CollisionGroup';
import { DynamicGameObject } from './DynamicGameObject';
import { WildMonsterStateMachine } from './state/monster/WildMonsterStateMachine';
import { IMonsterStateMachine } from './state/monster/IMonsterStateMachine';
import { Debuggable, DebugInformation, DebugShape } from './Debuggable';
import { Color } from '../shared/constants';
import { FollowingState } from './state/monster/FollowingState';
import Vector2 = Phaser.Math.Vector2;
import { CaughtMonsterStateMachine } from './state/monster/CaughtMonsterStateMachine';
import { PathFinding } from '../ai/PathFinding';
import { container } from 'tsyringe';
import { GreedyPathFinding } from '../ai/GreedyPathFinding';
import { GreedyMemorizedPathFinding } from '../ai/GreedyMemorizedPathFinding';
import Sprite = Phaser.Physics.Arcade.Sprite;

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

    private _caught = false;
    private _attentionRadius: number;

    protected stateMachine: IMonsterStateMachine;
    protected pathFinding: PathFinding;

    constructor(id: string, stats: MonsterStats, type: MonsterType) {
        super(id);
        this._type = type;
        this.stats = stats;
        this._attentionRadius = stats.attentionRadius;

        this.pathFinding = new GreedyMemorizedPathFinding();
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

    get caught(): boolean {
        return this._caught;
    }

    set caught(value: boolean) {
        this._caught = value;
    }

    get attentionRadius(): number {
        return this._attentionRadius;
    }

    set attentionRadius(value: number) {
        this._attentionRadius = value;
    }

    onAddToScene = (): void => {
        this.sprite.setMaxVelocity(50, 50);
        if (this.caught) {
            this.stateMachine = new CaughtMonsterStateMachine(this);
        } else {
            this.stateMachine = new WildMonsterStateMachine(this);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (time: number): void => {
        this.stateMachine.update(time, this);
        return;
    };

    moveTo = (goal: Vector2 | Sprite) => {
        this.pathFinding.moveTo(this, goal);
    };

    stopMoveTo = () => {
        this.break();
        this.pathFinding.reset();
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

    drawDebugInformation = (): DebugInformation[] => {
        return [
            [
                DebugShape.CIRCLE,
                {
                    center: () => this.sprite.getCenter(),
                    radius: () => this._attentionRadius,
                    color: () =>
                        this.stateMachine.currentState instanceof FollowingState && !this.caught
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
