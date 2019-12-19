import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { State } from '../State';
import { BaseGameObject } from '../../BaseGameObject';
import { MonsterObject } from '../../MonsterObject';
import { IdleState } from './IdleState';
import { getClosesTObj } from '../../../util/vector';

export class FollowingState implements MonsterState {
    constructor(private following: BaseGameObject | null) {}

    enter = (obj: MonsterObject): void => {
        obj.playWalkingAnim();
    };
    update = (
        monster: MonsterObject,
        objs: DynamicGameObject[]
    ): MonsterState => {
        const closestObj = getClosesTObj(monster, objs);
        if (closestObj.isEmpty()) {
            return new IdleState();
        }
        this.following = closestObj.value;
        monster.accelerateTowards(this.following.sprite.getCenter());
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject): void => {
        return;
    };
}
