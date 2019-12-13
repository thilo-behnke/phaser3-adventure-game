import "reflect-metadata";
import {container} from "tsyringe";

import ExplorationScene from "./scenes/ExplorationScene";
import {SceneProvider} from "./scene/SceneProvider";
import Scene = Phaser.Scene;
import {Test} from "./scenes/Test";

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

const explorationScene = new Phaser.Game(config);
// TODO: Is this really needed?
container.register<Test>(Test, {useClass: Test});
/*container.register<SceneProvider>(SceneProvider, {useClass: SceneProvider});*/
