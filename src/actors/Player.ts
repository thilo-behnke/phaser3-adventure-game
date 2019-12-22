import { DynamicGameObject } from './DynamicGameObject';
import { PlayerStateMachine } from './state/PlayerStateMachine';
import { KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import { Direction } from '../global/direction';
import Point = Phaser.Geom.Point;
import Scene = Phaser.Scene;

export class Player extends DynamicGameObject {
    protected acceleration = new Point(100, 100);
    protected stateMachine: PlayerStateMachine;

    private _direction: [Direction | null, Direction | null] = [Direction.DOWN, null]; // [VER, HOR]

    get direction(): [Direction, Direction] {
        return this._direction;
    }

    set direction(value: [Direction, Direction]) {
        const [ver, hor] = value;
        this._direction = [ver || this.direction[0], hor];
    }

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
            key: 'player-idle--DOWN',
            frames: scene.anims.generateFrameNames('player-atlas', {
                prefix: 'player-idle--DOWN.',
                start: 2,
                end: 3,
                zeroPad: 3,
            }),
            frameRate: 1,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-walking--DOWN',
            frames: scene.anims.generateFrameNames('player-atlas', {
                prefix: 'player-walking--DOWN.',
                start: 2,
                end: 3,
                zeroPad: 3,
            }),
            frameRate: 1,
            repeat: -1,
        });
        /*        scene.anims.create({
            key: 'player-idle--UP',
            frames: scene.anims.generateFrameNames('player', {
                start: 11,
                end: 12,
            }),
            frameRate: 3,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-walking--UP',
            frames: scene.anims.generateFrameNames('player', {
                start: 12,
                end: 13,
            }),
            frameRate: 3,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-idle--LEFT',
            frames: scene.anims.generateFrameNames('player', {
                start: 10,
                end: 11,
            }),
            frameRate: 3,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-walking--LEFT',
            frames: scene.anims.generateFrameNames('player', {
                start: 9,
                end: 10,
            }),
            frameRate: 3,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-idle--RIGHT',
            frames: scene.anims.generateFrameNames('player', {
                start: 6,
                end: 7,
            }),
            frameRate: 3,
            repeat: -1,
        });
        scene.anims.create({
            key: 'player-walking--RIGHT',
            frames: scene.anims.generateFrameNames('player', {
                start: 5,
                end: 6,
            }),
            frameRate: 3,
            repeat: -1,
        });*/
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

    // TODO: Refactor into one method.
    playIdleAnim = (): void => {
        const [ver, hor] = this.direction;
        const dominantDir = ver || hor;
        if (!dominantDir) {
            throw new Error(`Player does not have a valid direction! ${this.direction}`);
        }
        console.log({ dominantDir });
        this._sprite.anims.play(`player-idle--${dominantDir}`);
    };

    playWalkingAnim = (): void => {
        const [ver, hor] = this.direction;
        const dominantDir = ver || hor;
        if (!dominantDir) {
            throw new Error(`Player does not have a valid direction! ${this.direction}`);
        }
        console.log({ dominantDir });
        this._sprite.anims.play(`player-walking--${dominantDir}`);
    };
}
