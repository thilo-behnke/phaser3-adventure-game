import { IMonsterStateMachine } from './IMonsterStateMachine';
import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { FollowingState } from './FollowingState';
import { Player } from '../../Player';
import { GameObjectRegistry } from '../../../registry/GameObjectRegistry';
import { ObservingState } from './ObservingState';
import { container } from 'tsyringe';

export class CaughtMonsterStateMachine extends IMonsterStateMachine {
    currentState: MonsterState;

    constructor(monster: MonsterObject) {
        super();
        console.log('state machine created for monster', monster);
        const registry = container.resolve(GameObjectRegistry);
        // TODO: Maybe there needs to be another state "PlayerFollowingState"...
        this.currentState = new FollowingState(registry.getPlayer());
        this.currentState.enter(monster);
    }

    update = (time: number, monster: MonsterObject): void => {
        const registry = container.resolve(GameObjectRegistry);
        const objs = [registry.getPlayer()];
        const newState = this.currentState.update(time, monster, objs);
        if (newState !== this.currentState) {
            console.log('Caught Monster State has changed!', newState, monster);
            this.currentState.exit(monster);
            this.currentState = newState;
            newState.enter(monster);
        }
    };
}
