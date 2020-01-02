import 'reflect-metadata';

import ExplorationScene from './scenes/ExplorationScene';
import { generateConfig, SCREEN_HEIGHT, SCREEN_WIDTH } from './shared/constants';
import { MainMenuScene } from './scenes/MainMenuScene';

new Phaser.Game(generateConfig(MainMenuScene));
