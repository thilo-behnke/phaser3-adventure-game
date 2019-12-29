import { IPlayerStateMachine } from './player/IPlayerStateMachine';
import { ActiveActions } from '../../input/keyManager';
import { State } from './State';
import { IdleState } from './player/IdleState';
import { BaseGameObject } from '../BaseGameObject';
import { Player } from '../Player';
import { Direction } from '../../shared/direction';
import { Optional } from '../../util/fp';

export class PlayerStateMachine implements IPlayerStateMachine {
    currentState: State<ActiveActions>;

    constructor(obj: BaseGameObject) {
        this.currentState = new IdleState();
        this.currentState.enter(obj);
    }

    private extractDirectionFromActions = (actions: ActiveActions) => {
        const { x, y } = actions.directions;
        if (y) {
            return Optional.of(y);
        } else if (x) {
            return Optional.of(x);
        }
        return Optional.empty();
    };

    update = (time: number, obj: Player, actions: ActiveActions): void => {
        const newState = this.currentState.update(time, obj, actions);
        const direction = this.extractDirectionFromActions(actions);
        // Only set the direction if an direction action exists. Otherwise the direction does not change.
        if (!direction.isEmpty()) {
            obj.direction = direction.value;
        }
        if (newState !== this.currentState) {
            console.log('Player State has changed!', newState, obj);
            this.currentState = newState;
            newState.enter(obj);
        }
    };
}
