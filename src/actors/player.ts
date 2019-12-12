import { BaseGameObject } from './baseGameObject';
import GameObject = Phaser.GameObjects.GameObject;

export class Player extends BaseGameObject {
    static create = (
        scene: Phaser.Scene,
        initialPos: Phaser.Geom.Point
    ) => {
        const player = new Player(scene, 'player');
        player.sprite = scene.add.sprite(initialPos.x, initialPos.y, 'test', 0);
        return player;
    };

    update = (delta: number) => {
        // TODO: Implement.
    };
}
