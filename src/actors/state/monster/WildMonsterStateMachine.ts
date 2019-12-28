import { IPlayerStateMachine } from '../player/IPlayerStateMachine';
import { State } from '../State';
import { MonsterObject } from '../../MonsterObject';
import { Player } from '../../Player';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterState } from './MonsterState';
import { IMonsterStateMachine } from './IMonsterStateMachine';
import { IdleState } from './IdleState';
import { container } from 'tsyringe';
import { GameObjectRegistry } from '../../../registry/GameObjectRegistry';
import { FollowingState } from './FollowingState';
import { WanderingState } from './WanderingState';

export class WildMonsterStateMachine extends IMonsterStateMachine {
    currentState: MonsterState;

    constructor(monster: MonsterObject) {
        super();
        console.log('state machine created for monster', monster);
        this.currentState = new IdleState();
        this.currentState.enter(monster);
    }

    update = (time: number, monster: MonsterObject): void => {
        const registry = container.resolve(GameObjectRegistry);
        const monsterPos = monster.sprite.getCenter();
        const objs = [registry.getPlayer(), ...registry.getMonsters()]
            .filter(({ id }) => id !== monster.id)
            .filter(({ sprite }) => {
                const objPos = sprite.getCenter();
                return objPos.subtract(monsterPos).length() <= monster.attentionRadius;
            });
        const newState = this.currentState.update(time, monster, objs);
        if (newState !== this.currentState) {
            console.log('Monster State has changed!', newState, monster);
            monster.stopMoveTo();
            this.currentState.exit(monster);
            this.currentState = newState;
            newState.enter(monster);
        }
    };
}
