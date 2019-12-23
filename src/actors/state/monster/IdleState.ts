import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterObject } from '../../MonsterObject';
import { FollowingState } from './FollowingState';
import { getClosestObj } from '../../../util/vector';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';

export class IdleState implements MonsterState {
    enter = (monster: MonsterObject): void => {
        monster.sprite.setAcceleration(0, 0);
        monster.sprite.setVelocity(0, 0);
        monster.activeAnim = DynamicObjectAnimation.IDLE;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        // Don't do anything if there is nothing in the nearer area.
        if (!objs.length) {
            return this;
        }
        // TODO: Evaluate objects, maybe most dangerous?
        const preferredObj = getClosestObj(monster, objs);
        if (preferredObj.isEmpty()) {
            return this;
        }
        return new FollowingState(preferredObj.value);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject) => {
        return;
    };
}
