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
        this._selected = Math.abs(value % this.menus.length);
        this.renderMenu();
    }

    preload() {}

    create() {
        // TODO: This is probably always the same - generalize.
        this.keyManager = container.resolve(KeyManager);
        this.keyManager.configure(this);

        this.keyManager.assignAction(this, Action.DOWN, () => {
            this.selected++;
        });
        this.keyManager.assignAction(this, Action.UP, () => {
            this.selected--;
        });
        this.keyManager.assignAction(this, Action.CONFIRM, () => {
            this.executeSelected();
        });
        this.keyManager.assignAction(this, Action.CANCEL, () => {
            this.onClose();
        });

        const restart = this.add.text(500, 500, Menu.RESTART_GAME).setInteractive();
        restart.on('pointerdown', () => {
            this.onRestart();
        });
        const close = this.add.text(500, 550, Menu.CLOSE_MENU).setInteractive();
        close.on('pointerdown', () => {
            this.onClose();
        });
        this.menus = [restart, close];

        this.renderMenu();
    }

    update() {}

    private renderMenu() {
        this.menus.forEach((menu, i) => {
            if (i === this.selected) {
                this.menus[i].setBackgroundColor('red');
            } else {
                this.menus[i].setBackgroundColor('white');
            }
        });
    }

    private executeSelected() {
        const selectedMenu = this.menus[this.selected];
        if (selectedMenu.text === Menu.RESTART_GAME) {
            this.onRestart();
        } else if (selectedMenu.text === Menu.CLOSE_MENU) {
            this.onClose();
        }
    }

    private onRestart() {
        this.scene.start(SceneName.EXPLORATION);
    }

    private onClose() {
        this.scene.stop(SceneName.OVERLAY_MENU);
        this.scene.resume(SceneName.EXPLORATION);
    }
}
