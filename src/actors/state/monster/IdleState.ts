import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterNature, MonsterObject } from '../../MonsterObject';
import { FollowingState } from './FollowingState';
import { getClosestObj } from '../../../util/vector';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import { FleeingState } from './FleeingState';
import { getRandomNumberBetween } from '../../../util/random';
import { WanderingState } from './WanderingState';
import { Optional } from '../../../util/fp';
import { AttackingState } from './AttackingState';

export class IdleState implements MonsterState {
    enter = (monster: MonsterObject): void => {
        monster.sprite.setAcceleration(0, 0);
        monster.sprite.setVelocity(0, 0);
        monster.activeAnim = DynamicObjectAnimation.IDLE;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        // Don't do anything if there is nothing in the nearer area.
        if (!objs.length) {
            // By chance enter wandering mode.
            const randomNumber = getRandomNumberBetween(1000);
            if (randomNumber % 500 === 0) {
                return new WanderingState();
            }
            return this;
        }
        // TODO: Evaluate objects, maybe most dangerous?
        const preferredObj = getClosestObj(monster, objs) as Optional<DynamicGameObject>;
        if (preferredObj.isEmpty()) {
            return this;
        }
        if (monster.baseStats.nature === MonsterNature.AGGRESSIVE) {
            return new FollowingState(preferredObj.value);
        } else if (monster.baseStats.nature === MonsterNature.SHY) {
            return new FleeingState(preferredObj.value);
        }
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject) => {
        return;
    };
}
