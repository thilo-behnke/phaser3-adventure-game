import Key = Phaser.Input.Keyboard.Key;
import Scene = Phaser.Scene;
import { injectable, singleton } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { Direction } from '../global/direction';

export enum Action {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    UP = 'UP',
}

export type ActiveActions = {
    directions: {
        x: Direction | null;
        y: Direction | null;
    };
};

@singleton()
@injectable()
export class KeyManager {
    private scene: Scene;

    // Actions.
    private actions: { [key in Action]: Key };

    constructor(private sceneProvider: SceneProvider) {
        this.actions = {
            [Action.LEFT]: sceneProvider.addKey(
                Phaser.Input.Keyboard.KeyCodes.LEFT
            ),
            [Action.RIGHT]: sceneProvider.addKey(
                Phaser.Input.Keyboard.KeyCodes.RIGHT
            ),
            [Action.UP]: sceneProvider.addKey(
                Phaser.Input.Keyboard.KeyCodes.UP
            ),
            [Action.DOWN]: sceneProvider.addKey(
                Phaser.Input.Keyboard.KeyCodes.DOWN
            ),
        };
    }

    isDown = (action: Action): boolean => {
        return this.actions[action].isDown;
    };

    getActions = (): ActiveActions => {
        const leftDown = this.isDown(Action.LEFT),
            rightDown = this.isDown(Action.RIGHT),
            upDown = this.isDown(Action.UP),
            downDown = this.isDown(Action.DOWN);
        return {
            directions: {
                x:
                    (leftDown && Direction.LEFT) ||
                    (rightDown && Direction.RIGHT) ||
                    null,
                y:
                    (upDown && Direction.UP) ||
                    (downDown && Direction.DOWN) ||
                    null,
            },
        };
    };
}
