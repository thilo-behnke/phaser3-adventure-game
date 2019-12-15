import 'phaser';
import * as player from '../../assets/graphics/green-knight.png';
import { Player } from '../actors/Player';
import { Direction } from '../global/direction';
import { Action, KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { MonsterSpawner } from '../spawner/MonsterSpawner';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { ItemSpawner } from '../spawner/ItemSpawner';
import { ExplorationMap } from '../map/ExplorationMap';
import Point = Phaser.Geom.Point;

export default class ExplorationScene extends Phaser.Scene {
    private player: Player;
    private keyManager: KeyManager;
    private gameObjectRegistry: GameObjectRegistry;
    private sceneProvider: SceneProvider;
    private monsterSpawner: MonsterSpawner;
    private itemSpawner: ItemSpawner;

    constructor() {
        super('demo');
    }

    preload(): void {
        this.load.spritesheet('player', player, {
            frameWidth: 20,
            frameHeight: 29,
        });
    }

    create(): void {
        // TODO: Why does constructor autowiring not work here?
        this.sceneProvider = container.resolve(SceneProvider);
        this.sceneProvider.initialize(this);
        this.monsterSpawner = container.resolve(MonsterSpawner);
        this.itemSpawner = container.resolve(ItemSpawner);
        this.gameObjectRegistry = container.resolve(GameObjectRegistry);
        this.keyManager = container.resolve(KeyManager);
        this.player = Player.create(this, new Point(100, 100));
        this.gameObjectRegistry.setPlayer(this.player);

        this.monsterSpawner.spawn(new ExplorationMap());
        this.itemSpawner.spawn(new ExplorationMap());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(time: number, delta: number): void {
        // Update player position.
        this.player.update(delta);
    }
}
