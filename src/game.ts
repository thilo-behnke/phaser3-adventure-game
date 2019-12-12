import 'phaser';
import * as player from '../assets/green-knight.png';
import { Player } from './actors/player';
import { Direction } from './global/direction';
import { Action, KeyManager } from './input/keyManager';
import Point = Phaser.Geom.Point;
import { Capsule } from './actors/capsule';
import { MonsterFactory } from './factories/MonsterFactory';

export default class Demo extends Phaser.Scene {
    private player: Player;
    private keyManager: KeyManager;
    private monsterFactory: MonsterFactory;

    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('player', player);
    }

    create() {
        this.player = Player.create(this, new Point(100, 100));
        this.keyManager = KeyManager.create(this);
        this.monsterFactory = MonsterFactory.create(this);
        // TODO: Update colliders? Maybe inject into ColliderManager...
        this.monsterFactory.getGameObjects().subscribe();

        const itemObjects = [Capsule.create(this, new Point(20, 200))];
        const monsters = [this.monsterFactory.generate()];

        this.physics.add.overlap(
            this.player.getSprite(),
            itemObjects[0].getSprite(),
            () => console.log('overlap'),
            console.log,
            this
        );
        this.physics.add.collider(
            this.player.getSprite(),
            itemObjects[0].getSprite(),
            () => console.log('overlap'),
            console.log,
            this
        );
        /*        const itemCollider = this.physics.add.collider(this.player.sprite, items, console.log, console.log);*/
    }

    update(time: number, delta: number): void {
        // Update player position.
        if (this.keyManager.isDown(Action.LEFT)) {
            this.player.move(Direction.LEFT);
        } else if (this.keyManager.isDown(Action.RIGHT)) {
            this.player.move(Direction.RIGHT);
        } else if (this.keyManager.isDown(Action.DOWN)) {
            this.player.move(Direction.DOWN);
        } else if (this.keyManager.isDown(Action.UP)) {
            this.player.move(Direction.UP);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Demo,
    physics: {
        default: 'arcade',
        arcade: { debug: true },
    },
};

const game = new Phaser.Game(config);
