import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';

export class DyingState implements MonsterState {
    enter = (monster: MonsterObject) => {
        monster.sprite.setAcceleration(0, 0);
        monster.sprite.setVelocity(0, 0);
        monster.activeAnim = DynamicObjectAnimation.DYING;
    };
    exit = (monster: MonsterObject) => {
        return;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]) => {
        return this;
    };
}
