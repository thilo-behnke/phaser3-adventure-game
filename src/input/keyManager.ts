import Key = Phaser.Input.Keyboard.Key;
import Scene = Phaser.Scene;

export enum Action {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    UP = 'UP',
}

export class KeyManager {
    private scene: Scene;

    // Actions.
    private actions: { [key in Action]: Key };

    static create = (scene: Phaser.Scene) => {
        const keyManager = new KeyManager();
        keyManager.scene = scene;
        keyManager.actions = {
            [Action.LEFT]: scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.LEFT
            ),
            [Action.RIGHT]: scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.RIGHT
            ),
            [Action.UP]: scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.UP
            ),
            [Action.DOWN]: scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.DOWN
            ),
        };
        return keyManager;
    };

    isDown = (action: Action) => {
        return this.actions[action].isDown;
    };
}
