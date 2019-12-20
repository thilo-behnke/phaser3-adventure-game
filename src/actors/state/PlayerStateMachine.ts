import { IPlayerStateMachine } from './player/IPlayerStateMachine';
import { DynamicGameObject } from '../DynamicGameObject';
import { ActiveActions } from '../../input/keyManager';
import { State } from './State';
import { IdleState } from './player/IdleState';
import { BaseGameObject } from '../BaseGameObject';
import { Player } from '../Player';
import { PlayerState } from './player/PlayerState';

export class PlayerStateMachine implements IPlayerStateMachine {
    currentState: State<ActiveActions>;

    constructor(obj: BaseGameObject) {
        this.currentState = new IdleState();
        this.currentState.enter(obj);
    }

    update = (time: number, obj: Player, actions: ActiveActions): void => {
        const newState = this.currentState.update(time, obj, actions);
        if (newState !== this.currentState) {
            console.log('Player State has changed!', newState, obj);
            this.currentState = newState;
            newState.enter(obj);
        }
    };
}
