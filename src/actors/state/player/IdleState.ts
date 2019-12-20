import { State } from '../State';
import { BaseGameObject } from '../../BaseGameObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import { ActiveActions } from '../../../input/keyManager';
import { WalkingState } from './WalkingState';
import { Player } from '../../Player';
import { PlayerState } from './PlayerState';

export class IdleState implements PlayerState {
    enter = (obj: Player): void => {
        obj.sprite.setAcceleration(0, 0);
        obj.sprite.setVelocity(0, 0);
        obj.playIdleAnim();
    };
    update = (time: number, obj: Player, actions: ActiveActions): PlayerState => {
        if (!actions.directions.x && !actions.directions.y) {
            obj.sprite.setAcceleration(0, 0);
            obj.sprite.setVelocity(0, 0);
            return this;
        } else {
            this.exit(obj);
            return new WalkingState();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (obj: BaseGameObject): void => {
        return;
    };
}
