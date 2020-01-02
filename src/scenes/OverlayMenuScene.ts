import { Color, SceneName } from '../shared/constants';
import { Action, KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import Text = Phaser.GameObjects.Text;

enum Menu {
    RESTART_GAME = 'Restart Game',
    CLOSE_MENU = 'Close',
}

export class OverlayMenuScene extends Phaser.Scene {
    private keyManager: KeyManager;
    private menus: Text[];
    private _selected = 0;

    constructor(config: SettingsConfig) {
        super(config);
    }

    get selected(): number {
        return this._selected;
    }

    set selected(value: number) {
        this.menus[this._selected].setBackgroundColor('white');
        this._selected = value % this.menus.length;
        this.menus[this._selected].setBackgroundColor('red');
    }

    preload() {}

    create() {
        this.keyManager = container.resolve(KeyManager);

        const restart = this.add.text(500, 500, Menu.RESTART_GAME).setInteractive();
        restart.on('pointerdown', () => {
            this.scene.stop(SceneName.OVERLAY_MENU);
            this.scene.stop(SceneName.EXPLORATION);
            this.scene.start(SceneName.EXPLORATION);
        });
        const close = this.add.text(500, 550, Menu.CLOSE_MENU).setInteractive();
        close.on('pointerdown', () => {
            this.scene.stop(SceneName.OVERLAY_MENU);
            this.scene.resume(SceneName.EXPLORATION);
        });
        this.menus = [restart, close];
        this.keyManager.assignAction(Action.DOWN, () => {
            this.selected++;
        });
        this.keyManager.assignAction(Action.UP, () => {
            this.selected--;
        });
    }

    update() {}
}
