import 'phaser';
import * as player from '../../assets/graphics/green-knight.png';
import { Player } from '../actors/player';
import { Direction } from '../global/direction';
import { Action, KeyManager } from '../input/keyManager';
import Point = Phaser.Geom.Point;
import { Capsule } from '../actors/capsule';
import { MonsterFactory } from '../factories/MonsterFactory';
import { autoInjectable, container, inject, injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { Test } from './Test';
import { MonsterSpawner } from '../spawner/MonsterSpawner';
import {GameObjectRegistry} from "../registry/GameObjectRegistry";

export default class ExplorationScene extends Phaser.Scene {
    private player: Player;
    private keyManager: KeyManager;
    private gameObjectRegistry: GameObjectRegistry;
    private sceneProvider: SceneProvider;
    private monsterSpawner: MonsterSpawner;

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
        this.monsterSpawner = container.resolve(MonsterSpawner);
        this.gameObjectRegistry = container.resolve(GameObjectRegistry);
        this.keyManager = container.resolve(KeyManager);
        this.player = Player.create(this, new Point(100, 100));
        this.gameObjectRegistry.setPlayer(this.player);

        /*        const itemObjects = [Capsule.create(this, new Point(20, 200))];*/
        this.monsterSpawner.spawn({} as any);

        /*        this.physics.add.overlap(
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
        );*/
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
