import { State } from './State';
import { BaseGameObject } from '../BaseGameObject';
import { DynamicGameObject } from '../DynamicGameObject';
import { ActiveActions } from '../../input/keyManager';
import { WalkingState } from './WalkingState';

export class IdleState implements State {
    enter = (obj: DynamicGameObject): void => {
        obj.getSprite().setAcceleration(0, 0);
        obj.getSprite().setVelocity(0, 0);
        obj.playIdleAnim();
    };
    update = (obj: DynamicGameObject, actions: ActiveActions): State => {
        if (!actions.directions.x && !actions.directions.y) {
            obj.getSprite().setAcceleration(0, 0);
            obj.getSprite().setVelocity(0, 0);
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
