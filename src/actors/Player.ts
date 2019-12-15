import { BaseGameObject } from './BaseGameObject';
import Point = Phaser.Geom.Point;
import { DynamicGameObject } from './DynamicGameObject';
import { PlayerStateMachine } from './state/PlayerStateMachine';
import { KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';

export class Player extends DynamicGameObject {
    protected acceleration = new Point(100, 100);
    protected stateMachine: PlayerStateMachine;

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
        player.sprite.setCollideWorldBounds(true);
        player.stateMachine = new PlayerStateMachine(player);
        return player;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        const keyManager = container.resolve(KeyManager);
        this.stateMachine.update(delta, this, keyManager.getActions());

        return;
    };

    playIdleAnim = (): void => {
        this.sprite.anims.play('player-idle');
    };

    playWalkingAnim = (): void => {
        this.sprite.anims.play('player-walking');
    };
}
