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
        console.log('state machine created for monster', monster);
        this.currentState = new IdleState();
        this.currentState.enter(monster);
    }

    update = (time: number, monster: MonsterObject): void => {
        const registry = container.resolve(GameObjectRegistry);
        const { attentionRadius } = monster.getStats();
        const monsterPos = monster.sprite.getCenter();
        const objs = [registry.getPlayer()].filter(({ sprite }) => {
            const objPos = sprite.getCenter();
            return objPos.subtract(monsterPos).length() <= attentionRadius;
        });
        const newState = this.currentState.update(time, monster, objs);
        if (newState !== this.currentState) {
            console.log('Monster State has changed!', newState, monster);
            this.currentState = newState;
            newState.enter(monster);
        }
    };
}
