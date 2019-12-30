import { DynamicGameObject } from './DynamicGameObject';
import { PlayerStateMachine } from './state/PlayerStateMachine';
import { KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import { Direction } from '../shared/direction';
import Point = Phaser.Geom.Point;
import Scene = Phaser.Scene;
import { CanDie } from '../shared/CanDie';

export class Player extends DynamicGameObject implements CanDie {
    protected _type = 'player';
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
            .setDrag(50, 50)
            .setImmovable(true)
            .setName('player');
        player._sprite.setCollideWorldBounds(true);
        player.onAddToScene();
        player._stats = { health: 100000, agility: 200, strength: 1, attackRange: 10 };
        return player;
    };

    private createAnimations = (scene: Scene): void => {
        Object.values(Direction).forEach(direction => {
            scene.anims.create({
                key: `player-IDLE--${direction}`,
                frames: scene.anims.generateFrameNames(`player--${direction}`, {
                    start: 1,
                    end: 2,
                }),
                frameRate: 1,
                repeat: -1,
            });
            scene.anims.create({
                key: `player-WALKING--${direction}`,
                frames: scene.anims.generateFrameNames(`player--${direction}`, {
                    start: 0,
                    end: 5,
                }),
                frameRate: 6,
                repeat: -1,
            });
        });
    };

    onAddToScene = (): void => {
        this.stateMachine = new PlayerStateMachine(this);
        return;
    };

    preUpdate = () => {};

    afterUpdate = () => {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        const keyManager = container.resolve(KeyManager);
        this.stateMachine.update(delta, this, keyManager.getActions());
        this.direction = this.getDirection();

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

    onDeath = () => {
        return;
    };
}
