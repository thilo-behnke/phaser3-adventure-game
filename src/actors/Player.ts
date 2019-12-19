import { DynamicGameObject } from './DynamicGameObject';
import { PlayerStateMachine } from './state/PlayerStateMachine';
import { KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import Point = Phaser.Geom.Point;
import Scene = Phaser.Scene;
import { Direction } from '../global/direction';
import { SceneProvider } from '../scene/SceneProvider';

export class Player extends DynamicGameObject {
    protected acceleration = new Point(100, 100);
    protected stateMachine: PlayerStateMachine;

    static create = (scene: Phaser.Scene, initialPos: Phaser.Geom.Point): Player => {
        const player = new Player('player');
        player.createAnimations(scene);
        player._sprite = scene.physics.add
            .sprite(initialPos.x, initialPos.y, 'player', 0)
            .setMass(50)
            .setMaxVelocity(100, 100)
            .setFriction(100, 100)
            .setDrag(50, 50);
        player._sprite.setCollideWorldBounds(true);
        player.onAddToScene();
        return player;
    };

    private createAnimations = (scene: Scene): void => {
        scene.anims.create({
            key: 'player-idle',
            frames: scene.anims.generateFrameNames('player', {
                start: 0,
                end: 3,
            }),
            frameRate: 3,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-walking',
            frames: scene.anims.generateFrameNames('player', {
                start: 4,
                end: 6,
            }),
            frameRate: 3,
            repeat: -1,
        });
    };

    onAddToScene = (): void => {
        this.stateMachine = new PlayerStateMachine(this);
        return;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        const keyManager = container.resolve(KeyManager);
        this.stateMachine.update(delta, this, keyManager.getActions());

        return;
    };

    public accelerate = (directions: { x: Direction | null; y: Direction | null }): void => {
        const { x: dirX, y: dirY } = directions;
        const accX =
            dirX === Direction.LEFT
                ? -this.acceleration.x
                : dirX === Direction.RIGHT
                ? this.acceleration.x
                : 0;
        const accY =
            dirY === Direction.UP
                ? -this.acceleration.y
                : dirY === Direction.DOWN
                ? this.acceleration.y
                : 0;
        this.sprite.setAcceleration(accX, accY);
    };

    playIdleAnim = (): void => {
        this._sprite.anims.play('player-idle');
    };

    playWalkingAnim = (): void => {
        this._sprite.anims.play('player-walking');
    };
}
