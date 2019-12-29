import { State } from '../State';
import { MonsterObject } from '../../MonsterObject';
import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import { getClosestObj } from '../../../util/vector';
import { WanderingState } from './WanderingState';
import { Optional } from '../../../util/fp';
import { FollowingState } from './FollowingState';

export class AttackingState implements MonsterState {
    constructor(private attacking: DynamicGameObject) {}

    enter = (monster: MonsterObject) => {
        monster.sprite.setAcceleration(0, 0);
        monster.sprite.setVelocity(0, 0);
        monster.activeAnim = DynamicObjectAnimation.ATTACKING;
        monster.attentionRadius *= 2;
    };
    exit = (monster: MonsterObject) => {
        monster.attentionRadius = monster.baseStats.attentionRadius;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]) => {
        const closestObj = getClosestObj(monster, objs) as Optional<DynamicGameObject>;
        if (closestObj.isEmpty()) {
            return new WanderingState();
        }
        if (
            closestObj.value.sprite
                .getCenter()
                .clone()
                .subtract(monster.sprite.getCenter())
                .length() > monster.baseStats.attackRange
        ) {
            return new FollowingState(closestObj.value);
        }
        this.attacking = closestObj.value;
        monster.attack(this.attacking);
        return this;
    };
}
