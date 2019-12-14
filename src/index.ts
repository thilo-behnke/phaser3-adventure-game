import 'reflect-metadata';

import ExplorationScene from './scenes/ExplorationScene';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: ExplorationScene,
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
};

new Phaser.Game(config);
