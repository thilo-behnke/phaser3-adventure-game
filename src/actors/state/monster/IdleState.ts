import { Player } from '../../Player';
import { State } from '../State';
import { BaseGameObject } from '../../BaseGameObject';
import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterObject } from '../../MonsterObject';
import { FollowingState } from './FollowingState';

export class IdleState implements MonsterState {
    enter = (monster: MonsterObject): void => {
        monster.getSprite().setAcceleration(0, 0);
        monster.getSprite().setVelocity(0, 0);
        monster.playIdleAnim();
    };
    update = (
        monster: MonsterObject,
        objs: DynamicGameObject[]
    ): MonsterState => {
        // Don't do anything if there is nothing in the nearer area.
        if (!objs.length) {
            return this;
        }
        // TODO: Evaluate objects, maybe most dangerous?
        const preferredObj = objs[0];
        return new FollowingState(preferredObj);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject) => {
        return;
    };
}
