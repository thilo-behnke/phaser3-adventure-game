import 'phaser';
import { Player } from './actors/player';
import { Direction } from './global/direction';
import { Action, KeyManager } from './input/keyManager';
import Point = Phaser.Geom.Point;
import {Capsule} from "./actors/capsule";

export default class Demo extends Phaser.Scene {
    private player: Player;
    private keyManager: KeyManager;

    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('libs', 'assets/libs.png');
        this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
        this.load.glsl('stars', 'assets/starfields.glsl.js');
    }

    create() {
        this.player = Player.create(this, new Point(100, 100));
        this.keyManager = KeyManager.create(this);

        const itemObjects = [Capsule.create(this, new Point(20, 200))];
        const items = this.physics.add.group(itemObjects);


        const itemCollider = this.physics.add.collider(this.player, items, console.log, console.log);
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
        arcade: { debug: true }
    }
};

const game = new Phaser.Game(config);
