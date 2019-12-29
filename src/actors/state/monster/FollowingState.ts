import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { BaseGameObject } from '../../BaseGameObject';
import { MonsterObject } from '../../MonsterObject';
import { getClosestObj } from '../../../util/vector';
import { WanderingState } from './WanderingState';
import { isCloseTo } from '../../../util/collision';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import { container } from 'tsyringe';
import { SceneProvider } from '../../../scene/SceneProvider';
import Scene = Phaser.Scene;
import { PathFinding } from '../../../ai/PathFinding';
import { CollisionDetectionManager } from '../../../collision/CollisionDetectionManager';
import { IdleState } from './IdleState';
import { AttackingState } from './AttackingState';
import { Optional } from '../../../util/fp';

export class FollowingState implements MonsterState {
    private sceneProvider: SceneProvider;
    private collisionDetectionManager: CollisionDetectionManager;

    constructor(public following: DynamicGameObject | null) {
        this.sceneProvider = container.resolve(SceneProvider);
        this.collisionDetectionManager = container.resolve(CollisionDetectionManager);
    }

    enter = (obj: MonsterObject): void => {
        obj.attentionRadius = obj.baseStats.attentionRadius * 2;
        obj.activeAnim = DynamicObjectAnimation.WALKING;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        const closestObj = getClosestObj(monster, objs) as Optional<DynamicGameObject>;
        if (closestObj.isEmpty()) {
            return new WanderingState();
        }
        this.following = closestObj.value;
        // Stop following when very close to the obj.
        if (this.collisionDetectionManager.isCollidingWith(monster, this.following)) {
            monster.stopMoveTo();
            return new AttackingState(this.following);
        } else {
            monster.moveTo(this.following.sprite);
        }
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject): void => {
        monster.attentionRadius = monster.baseStats.attentionRadius;
        return;
    };
}
