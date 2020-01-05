import { generateConfig, SceneName, SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';
import ExplorationScene from './ExplorationScene';
import { OverlayMenuScene } from './OverlayMenuScene';
import { HUDScene } from './HUDScene';
import { KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import { InventoryScene } from '../inventory/InventoryScene';

export class MainMenuScene extends Phaser.Scene {
    preload() {}

    create() {
        container.register<KeyManager>(KeyManager, { useValue: new KeyManager() });

        this.add
            .text(100, 100, 'Start Game')
            .setInteractive()
            .on('pointerdown', () => this.startGame());
        this.add.text(100, 150, 'Quit');
        this.scene.add(SceneName.EXPLORATION, ExplorationScene, false);
        this.scene.add(SceneName.OVERLAY_MENU, OverlayMenuScene, false, { transparent: true });
        this.scene.add(SceneName.HUD, HUDScene, false, { transparent: true });
        this.scene.add(SceneName.INVENTORY, InventoryScene, false, { transparent: true });
    }

    private startGame = () => {
        this.scene.start(SceneName.EXPLORATION);
    };

    update() {}
}
