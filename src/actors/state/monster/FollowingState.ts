import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { State } from '../State';
import { BaseGameObject } from '../../BaseGameObject';
import { MonsterObject } from '../../MonsterObject';
import { IdleState } from './IdleState';
import { getClosestObj } from '../../../util/vector';
import { ObservingState } from './ObservingState';

export class FollowingState implements MonsterState {
    constructor(private following: BaseGameObject | null) {}

    enter = (obj: MonsterObject): void => {
        obj.playWalkingAnim();
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        const closestObj = getClosestObj(monster, objs);
        if (closestObj.isEmpty()) {
            return new ObservingState();
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
