import { CollisionGroupDef } from '../collision/CollisionGroupDef';
import { CollisionGroup, CollisionType } from '../collision/CollisionGroup';
import { BaseStats, DynamicGameObject } from './DynamicGameObject';
import { WildMonsterStateMachine } from './state/monster/WildMonsterStateMachine';
import { IMonsterStateMachine } from './state/monster/IMonsterStateMachine';
import { Debuggable, DebugInformation, DebugShape } from './Debuggable';
import { Color } from '../shared/constants';
import { FollowingState } from './state/monster/FollowingState';
import { CaughtMonsterStateMachine } from './state/monster/CaughtMonsterStateMachine';
import { PathFinding } from '../ai/PathFinding';
import { GreedyMemorizedPathFinding } from '../ai/GreedyMemorizedPathFinding';
import { DynamicObjectAnimation } from './anim/DynamicObjectAnimation';
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.Physics.Arcade.Sprite;
import { CanDie } from '../shared/CanDie';
import { AttackingState } from './state/monster/AttackingState';

export enum MonsterType {
    WOLF = 'WOLF',
    SHEEP = 'SHEEP',
}

export const NUMBER_OF_MONSTERS = Object.keys(MonsterType).length;

export enum MonsterNature {
    AGGRESSIVE = 'AGGRESSIVE',
    SHY = 'SHY',
}

export type MonsterStats = BaseStats & {
    attentionRadius: number;
    nature: MonsterNature;
};

@CollisionGroupDef(
    [CollisionGroup.PLAYER, CollisionType.COLLIDE],
    [CollisionGroup.MONSTER, CollisionType.COLLIDE]
)
export class MonsterObject extends DynamicGameObject implements CanDie, Debuggable {
    protected _type: MonsterType;

    private _caught = false;
    private _attentionRadius: number;

    protected stateMachine: IMonsterStateMachine;
    protected pathFinding: PathFinding;

    constructor(id: string, stats: MonsterStats, type: MonsterType) {
        super(id);
        this._type = type;
        this._stats = stats;
        this._hp = stats.health;
        this._attentionRadius = stats.attentionRadius;

        this.pathFinding = new GreedyMemorizedPathFinding();
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

    get baseStats() {
        return super.baseStats as MonsterStats;
    }

    accelerateTowards = (pos: Vector2): void => {
        // TODO: This works, but it would be better if the sprite would check its own height / width to properly navigate colliding tiles.
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
        const newAcc =
            angleBetweenCurrentAndNewDir >= 0.5
                ? dir.scale(this.baseStats.agility)
                : dir.scale(this.baseStats.agility / 2);
        // TODO: It would be better to accelerate here instead of directly setting the velocity, however this looks/feels weird.
        this.sprite.setVelocity(newAcc.x, newAcc.y);
    };

    break = () => {
        this.sprite.setVelocity(0, 0);
    };

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
                DebugShape.CIRCLE,
                {
                    center: () => this.sprite.getCenter(),
                    radius: () => this.baseStats.attackRange,
                    color: () =>
                        this.stateMachine.currentState instanceof AttackingState && !this.caught
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
