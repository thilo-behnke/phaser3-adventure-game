import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import Vector2 = Phaser.Math.Vector2;

export interface IMonsterStateMachine {
    currentState: MonsterState;

    update: (time: number, monster: MonsterObject) => void;
    isMovingTowardsPos: () => Vector2 | null;
}
