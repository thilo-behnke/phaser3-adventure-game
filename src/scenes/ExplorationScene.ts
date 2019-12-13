import 'phaser';
import * as player from '../../assets/green-knight.png';
import { Player } from '../actors/player';
import { Direction } from '../global/direction';
import { Action, KeyManager } from '../input/keyManager';
import Point = Phaser.Geom.Point;
import { Capsule } from '../actors/capsule';
import { MonsterFactory } from '../factories/MonsterFactory';
import {autoInjectable, container, inject, injectable} from "tsyringe";
import {SceneProvider} from "../scene/SceneProvider";
import {Test} from "./Test";

export default class ExplorationScene extends Phaser.Scene {
    private player: Player;
    private keyManager: KeyManager;
    private sceneProvider: SceneProvider;
    private monsterFactory: MonsterFactory;

    constructor() {
        super('demo');
    }

    preload() {
        this.load.image('player', player);
    }

    create() {
        // TODO: Why does constructor autowiring not work here?
        this.sceneProvider = container.resolve(SceneProvider);
        this.sceneProvider.initialize(this);
        this.monsterFactory = container.resolve(MonsterFactory);
        this.keyManager = container.resolve(KeyManager);
        this.player = Player.create(this, new Point(100, 100));

        const itemObjects = [Capsule.create(this, new Point(20, 200))];
        this.monsterFactory.generate(new Point(100, 200));

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
