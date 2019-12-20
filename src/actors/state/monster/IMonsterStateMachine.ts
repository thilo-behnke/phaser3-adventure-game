import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { DynamicGameObject } from '../../DynamicGameObject';

export interface IMonsterStateMachine {
    currentState: MonsterState;

    update: (time: number, monster: MonsterObject) => void;
}
