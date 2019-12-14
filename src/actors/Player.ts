import { BaseGameObject } from './BaseGameObject';

export class Player extends BaseGameObject {
    static create = (
        scene: Phaser.Scene,
        initialPos: Phaser.Geom.Point
    ): Player => {
        const player = new Player('player');
        player.sprite = scene.physics.add.sprite(
            initialPos.x,
            initialPos.y,
            'player',
            0
        );
        return player;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        // TODO: Implement.
        return;
    };
}
