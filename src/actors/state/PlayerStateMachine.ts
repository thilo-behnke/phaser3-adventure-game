import { StateMachine } from './StateMachine';
import { DynamicGameObject } from '../DynamicGameObject';
import { ActiveActions } from '../../input/keyManager';
import { State } from './State';
import { IdleState } from './IdleState';
import { BaseGameObject } from '../BaseGameObject';

export class PlayerStateMachine implements StateMachine {
    currentState: State;

    constructor(obj: BaseGameObject) {
        this.currentState = new IdleState();
        this.currentState.enter(obj);
    }

    update = (
        delta: number,
        obj: DynamicGameObject,
        actions: ActiveActions
    ): void => {
        const newState = this.currentState.update(obj, actions);
        if (newState !== this.currentState) {
            console.log('Player State has changed!', newState, obj);
            this.currentState = newState;
            newState.enter(obj);
        }
    };
}
