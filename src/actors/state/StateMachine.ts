import { DynamicGameObject } from '../DynamicGameObject';
import { ActiveActions } from '../../input/keyManager';
import { State } from './State';

export interface StateMachine {
    currentState: State;

    update: (
        delta: number,
        obj: DynamicGameObject,
        actions: ActiveActions
    ) => void;
}
