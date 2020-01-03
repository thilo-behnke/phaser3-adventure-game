import { State } from '../State';
import { BaseGameObject } from '../../BaseGameObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import { ActiveActions } from '../../../input/keyManager';
import { IdleState } from './IdleState';
import { Player } from '../../Player';
import { PlayerState } from './PlayerState';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';

export class WalkingState implements PlayerState {
    enter = (obj: Player): void => {
        obj.activeAnim = DynamicObjectAnimation.WALKING;
    };
    update = (time: number, obj: Player, actions: ActiveActions): PlayerState => {
        if (
            actions.directions.x ||
            actions.directions.y ||
            Math.abs(obj.sprite.body.velocity.x) > 10 ||
            Math.abs(obj.sprite.body.velocity.y) > 10
        ) {
            obj.accelerate(actions.directions);
            return this;
        } else {
            this.exit(obj);
            return new IdleState();
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (obj: BaseGameObject): void => {
        return;
    };
}
