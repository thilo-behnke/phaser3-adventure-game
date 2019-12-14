import { BaseGameObject } from './BaseGameObject';
import GameObject = Phaser.GameObjects.GameObject;

export class Player extends BaseGameObject {
    static create = (scene: Phaser.Scene, initialPos: Phaser.Geom.Point) => {
        const player = new Player('player');
        player.sprite = scene.physics.add.sprite(
            initialPos.x,
            initialPos.y,
            'player',
            0
        );
        return player;
    };

    update = (delta: number) => {
        // TODO: Implement.
    };
}
