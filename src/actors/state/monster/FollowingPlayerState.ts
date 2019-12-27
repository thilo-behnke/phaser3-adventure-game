import { MonsterState } from './MonsterState';
import { BaseGameObject } from '../../BaseGameObject';
import { MonsterObject } from '../../MonsterObject';
import { Player } from '../../Player';
import { DynamicGameObject } from '../../DynamicGameObject';
import { isCloseTo } from '../../../util/collision';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';

export class FollowingPlayerState implements MonsterState {
    constructor(public player: Player) {}

    enter = (obj: MonsterObject): void => {
        obj.activeAnim = DynamicObjectAnimation.WALKING;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        // Stop following when very close to the obj.
        if (isCloseTo(monster, this.player)) {
            monster.break();
        } else {
            monster.moveTo(this.player.sprite);
        }
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject): void => {
        return;
    };
}
