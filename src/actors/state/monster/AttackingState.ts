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
    private lastAttack: number;

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
        // TODO: Do we need an in game clock? Because time would go by faster on slow frame rates.
        if (
            !this.lastAttack ||
            Date.now() - this.lastAttack > 2000 / (monster.baseStats.agility / 50)
        ) {
            monster.attack(this.attacking);
            this.lastAttack = Date.now();
        }
        return this;
    };
}
