import { BaseGameObject } from './BaseGameObject';
import { StateMachine } from './state/StateMachine';
import { Direction } from '../global/direction';

export abstract class DynamicGameObject extends BaseGameObject {
    protected stateMachine: StateMachine;

    abstract playIdleAnim: () => void;
    abstract playWalkingAnim: () => void;

    public accelerate = (directions: {
        x: Direction | null;
        y: Direction | null;
    }): void => {
        const { x: dirX, y: dirY } = directions;
        const accX =
            dirX === Direction.LEFT
                ? -this.acceleration.x
                : dirX === Direction.RIGHT
                ? this.acceleration.x
                : 0;
        const accY =
            dirY === Direction.UP
                ? -this.acceleration.y
                : dirY === Direction.DOWN
                ? this.acceleration.y
                : 0;
        this.getSprite().setAcceleration(accX, accY);
    };
}
