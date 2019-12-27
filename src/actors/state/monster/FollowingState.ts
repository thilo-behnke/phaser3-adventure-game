import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { BaseGameObject } from '../../BaseGameObject';
import { MonsterObject } from '../../MonsterObject';
import { getClosestObj } from '../../../util/vector';
import { ObservingState } from './ObservingState';
import { isCloseTo } from '../../../util/collision';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import { container } from 'tsyringe';
import { SceneProvider } from '../../../scene/SceneProvider';
import Scene = Phaser.Scene;
import { PathFinding } from '../../../ai/PathFinding';

export class FollowingState implements MonsterState {
    private sceneProvider: SceneProvider;

    constructor(public following: BaseGameObject | null) {
        this.sceneProvider = container.resolve(SceneProvider);
    }

    enter = (obj: MonsterObject): void => {
        obj.attentionRadius = obj.baseStats.attentionRadius * 2;
        obj.activeAnim = DynamicObjectAnimation.WALKING;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        const closestObj = getClosestObj(monster, objs);
        if (closestObj.isEmpty()) {
            return new ObservingState();
        }
        this.following = closestObj.value;
        // Stop following when very close to the obj.
        if (isCloseTo(monster, this.following)) {
            monster.break();
        } else {
            monster.moveTo(this.following.sprite.getCenter());
        }
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject): void => {
        monster.attentionRadius = monster.baseStats.attentionRadius;
        return;
    };
}
