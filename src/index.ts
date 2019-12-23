import 'reflect-metadata';

import ExplorationScene from './scenes/ExplorationScene';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './shared/constants';

const config = {
    type: Phaser.AUTO,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    scene: ExplorationScene,
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
};

new Phaser.Game(config);
