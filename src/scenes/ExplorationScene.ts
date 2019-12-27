import 'phaser';
import * as tiles from '../../assets/graphics/tilesheet.png';
import * as level1 from '../../assets/map/level_1.json';
import * as playerBack from '../../assets/graphics/hero/hero-male-back-walk.png';
import * as playerFront from '../../assets/graphics/hero/hero-male-front-walk.png';
import * as playerLeft from '../../assets/graphics/hero/hero-male-left-walk.png';
import * as playerRight from '../../assets/graphics/hero/hero-male-right-walk.png';
import * as wolf from '../../assets/graphics/green-knight.png';
import { Player } from '../actors/Player';
import { Action, KeyManager } from '../input/keyManager';
import { container } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { MonsterSpawner } from '../spawner/MonsterSpawner';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { ItemSpawner } from '../spawner/ItemSpawner';
import { ExplorationMap } from '../map/ExplorationMap';
import { Inventory } from '../inventory/Inventory';
import { InventoryUi } from '../inventory/InventoryUi';
import { DebugService } from '../util/DebugService';
import Point = Phaser.Geom.Point;
import { tileCollider } from '../util/collision';

export default class ExplorationScene extends Phaser.Scene {
    private debugService: DebugService;
    private player: Player;
    private keyManager: KeyManager;
    private gameObjectRegistry: GameObjectRegistry;
    private inventory: Inventory;
    private sceneProvider: SceneProvider;
    private monsterSpawner: MonsterSpawner;
    private itemSpawner: ItemSpawner;

    // Ui elements.
    private inventoryUi: InventoryUi;

    constructor() {
        super('demo');
    }

    preload(): void {
        // Tileset + map.
        this.load.image('tiles', tiles);
        this.load.tilemapTiledJSON('map', level1);
        // Object sprites.
        this.load.spritesheet('player--DOWN', playerFront, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('player--UP', playerBack, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('player--LEFT', playerLeft, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('player--RIGHT', playerRight, {
            frameWidth: 32,
            frameHeight: 32,
        });
        // TODO: Replace with proper spritesheet.
        this.load.spritesheet('WOLF', wolf, {
            frameWidth: 20,
            frameHeight: 29,
        });
        this.load.image('CAPSULE', 'assets/CAPSULE.png');
        this.load.image('CAPSULE_INVENTORY', 'assets/CAPSULE_INVENTORY.png');
        this.load.image('CAPSULE_INVENTORY_INACTIVE', 'assets/CAPSUL_INVENTORY_INACTIVE.png');
    }

    create(): void {
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tilesheet', 'tiles');
        const groundLayer = map.createStaticLayer('Ground', tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });

        // TODO: Why does constructor autowiring not work here?
        this.sceneProvider = container.resolve(SceneProvider);
        this.sceneProvider.initialize(this, groundLayer);

        this.debugService = container.resolve(DebugService);
        this.gameObjectRegistry = container.resolve(GameObjectRegistry);
        this.keyManager = container.resolve(KeyManager);
        this.player = Player.create(this, new Point(100, 100));
        this.gameObjectRegistry.setPlayer(this.player);
        this.monsterSpawner = container.resolve(MonsterSpawner);
        this.itemSpawner = container.resolve(ItemSpawner);
        this.inventory = container.resolve(Inventory);

        // TODO: Generalize with monster collision register.
        this.physics.add.collider(this.player.sprite, groundLayer, tileCollider);

        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        // TODO: Player can't move past the screen width / height defined in the game config.
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.monsterSpawner.spawn(new ExplorationMap());
        this.itemSpawner.spawn(new ExplorationMap());

        // Initialize Ui Elements
        this.inventoryUi = container.resolve(InventoryUi);
        // Initialize Controls
        this.keyManager.assignAction(Action.INVENTORY, () => this.inventoryUi.toggle());
        // Debugging.
        this.debugService.showGrid(true);
        this.debugService.showPlayerPos();
        const monster = this.gameObjectRegistry.getObjects()[0];
        this.debugService.showObjectPos(monster.id);
        this.debugService.enableObjectDebugInformation();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(time: number, delta: number): void {
        // Update player position.
        this.player.update(delta);
        this.gameObjectRegistry.getObjects().forEach(obj => obj.update(time));
        this.debugService.update();
    }
}
