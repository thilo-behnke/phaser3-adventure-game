import { BaseGameObject } from './BaseGameObject';
import DYNAMIC_BODY = Phaser.Physics.Arcade.DYNAMIC_BODY;

export class Player extends BaseGameObject {
    static create = (
        scene: Phaser.Scene,
        initialPos: Phaser.Geom.Point
    ): Player => {
        const player = new Player('player');
        player.sprite = scene.physics.add
            .sprite(initialPos.x, initialPos.y, 'player', 0)
            .setMass(50)
            .setMaxVelocity(100, 100)
            .setFriction(100, 100)
            .setDrag(50, 50);
        player.sprite.anims.play('player-idle');
        player.sprite.setCollideWorldBounds(true);
        return player;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        // TODO: Implement.
        return;
    };
}
