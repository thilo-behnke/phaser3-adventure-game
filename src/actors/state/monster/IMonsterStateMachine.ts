import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { DynamicGameObject } from '../../DynamicGameObject';

export interface IMonsterStateMachine {
    currentState: MonsterState;

    update: (delta: number, monster: MonsterObject) => void;
}
