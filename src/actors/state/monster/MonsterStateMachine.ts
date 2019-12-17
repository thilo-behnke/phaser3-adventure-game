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

export class MonsterStateMachine implements IMonsterStateMachine {
    currentState: MonsterState;

    constructor(monster: MonsterObject) {
        console.log("state machine created for monster", monster)
        this.currentState = new IdleState();
        this.currentState.enter(monster);
    }

    update = (delta: number, monster: MonsterObject): void => {
        const registry = container.resolve(GameObjectRegistry);
        const objs = [registry.getPlayer()];
        const newState = this.currentState.update(monster, objs);
        if (newState !== this.currentState) {
            console.log('Monster State has changed!', newState, monster);
            this.currentState = newState;
            newState.enter(monster);
        }
    };
}
