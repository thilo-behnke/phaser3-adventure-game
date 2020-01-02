import Key = Phaser.Input.Keyboard.Key;
import Scene = Phaser.Scene;
import { injectable, singleton } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { Direction } from '../shared/direction';
import ExplorationScene from '../scenes/ExplorationScene';
import { OverlayMenuScene } from '../scenes/OverlayMenuScene';
import EventEmitter = Phaser.Events.EventEmitter;
import { MainMenuScene } from '../scenes/MainMenuScene';

export enum Action {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    DOWN = 'DOWN',
    UP = 'UP',
    CONFIRM = 'CONFIRM',
    CANCEL = 'CANCEL',
    INVENTORY = 'INVENTORY',
    MENU = 'MENU',
}

export type ActiveActions = {
    directions: {
        x: Direction.LEFT | Direction.RIGHT | null;
        y: Direction.UP | Direction.DOWN | null;
    };
};

@singleton()
@injectable()
export class KeyManager {
    // Actions.
    private actions: { [key: string]: { [key: string]: Key } } = {};
    private assignedActions: { [key: string]: { [key: string]: EventEmitter } } = {};

    configure(scene: Phaser.Scene) {
        if (this.actions[scene.sys.settings.key]) {
            return;
        }
        if (scene instanceof ExplorationScene) {
            this.actions[scene.sys.settings.key] = {
                [Action.LEFT]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                [Action.RIGHT]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                [Action.UP]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                [Action.DOWN]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                [Action.INVENTORY]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
                [Action.MENU]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
            };
        } else if (scene instanceof OverlayMenuScene || scene instanceof MainMenuScene) {
            this.actions[scene.sys.settings.key] = {
                [Action.UP]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                [Action.DOWN]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                [Action.CONFIRM]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
                [Action.CANCEL]: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),
            };
        }

        this.assignedActions[scene.sys.settings.key] = {};
    }

    assignAction = (scene: Phaser.Scene, action: Action, callback): void => {
        if (this.assignedActions[scene.sys.settings.key][action]) {
            return;
        }
        this.assignedActions[scene.sys.settings.key][action] = this.actions[scene.sys.settings.key][
            action
        ].on('down', callback);
    };

    isDown = (scene: Phaser.Scene, action: Action): boolean => {
        return this.actions[scene.sys.settings.key][action].isDown;
    };

    getActions = (scene: Phaser.Scene): ActiveActions => {
        const leftDown = this.isDown(scene, Action.LEFT),
            rightDown = this.isDown(scene, Action.RIGHT),
            upDown = this.isDown(scene, Action.UP),
            downDown = this.isDown(scene, Action.DOWN);
        return {
            directions: {
                x: (leftDown && Direction.LEFT) || (rightDown && Direction.RIGHT) || null,
                y: (upDown && Direction.UP) || (downDown && Direction.DOWN) || null,
            },
        };
    };
}
