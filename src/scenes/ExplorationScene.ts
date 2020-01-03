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
import { UIService } from '../util/UIService';
import Point = Phaser.Geom.Point;
import { tileCollider } from '../util/collision';
import Tile = Phaser.Tilemaps.Tile;
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { EventRegistry } from '../event/EventRegistry';
import { SceneName } from '../shared/constants';
import { GameScene } from './GameScene';

export default class ExplorationScene extends Phaser.Scene implements GameScene {
    private uiService: UIService;
    private collisionDetectionManager: CollisionDetectionManager;
    private player: Player;
    private keyManager: KeyManager;
    private gameObjectRegistry: GameObjectRegistry;
    private inventory: Inventory;
    private sceneProvider: SceneProvider;
    private monsterSpawner: MonsterSpawner;
    private itemSpawner: ItemSpawner;

    // Ui elements.
    private inventoryUi: InventoryUi;
    private eventRegistry: EventRegistry;

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
        // Singleton workaround...
        container.register<GameObjectRegistry>(GameObjectRegistry, {
            useValue: new GameObjectRegistry(),
        });
        container.register<SceneProvider>(SceneProvider, { useValue: new SceneProvider() });
        container.register<EventRegistry>(EventRegistry, { useValue: new EventRegistry() });
        container.register<UIService>(UIService, { useValue: new UIService() });
        container.register<CollisionDetectionManager>(CollisionDetectionManager, {
            useValue: new CollisionDetectionManager(),
        });
        container.register<MonsterSpawner>(MonsterSpawner, { useValue: new MonsterSpawner() });
        container.register<ItemSpawner>(ItemSpawner, { useValue: new ItemSpawner() });
        container.register<Inventory>(Inventory, { useValue: new Inventory() });
        container.register<InventoryUi>(InventoryUi, { useValue: new InventoryUi() });

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('tilesheet', 'tiles');
        const groundLayer = map.createStaticLayer('Ground', tileset, 0, 0);
        groundLayer.setCollisionByProperty({ collides: true });

        // TODO: Why does constructor autowiring not work here?
        this.sceneProvider = container.resolve(SceneProvider);
        this.sceneProvider.initialize(this, map, groundLayer);
        this.eventRegistry = container.resolve(EventRegistry);

        this.uiService = container.resolve(UIService);
        this.gameObjectRegistry = container.resolve(GameObjectRegistry);

        this.collisionDetectionManager = container.resolve(CollisionDetectionManager);
        this.keyManager = container.resolve(KeyManager);
        this.keyManager.configure(this);
        this.player = Player.create(this, new Point(100, 100));
        this.gameObjectRegistry.setPlayer(this.player);
        this.monsterSpawner = container.resolve(MonsterSpawner);
        this.itemSpawner = container.resolve(ItemSpawner);
        this.inventory = container.resolve(Inventory);

        // TODO: Generalize with monster collision register.
        this.physics.add.collider(this.player.sprite, groundLayer, (objA, objB) => {
            const tile = objB as any;
            return tileCollider(this.player, tile);
        });

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        const camera = this.cameras.main;
        camera.startFollow(this.player.sprite);
        // TODO: Player can't move past the screen width / height defined in the game config.
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Initialize Ui Elements
        this.inventoryUi = container.resolve(InventoryUi);
        // Initialize Controls
        this.keyManager.assignAction(this, Action.INVENTORY, () => this.inventoryUi.toggle());
        this.keyManager.assignAction(this, Action.MENU, () => {
            this.launchMenu();
        });

        this.uiService.configureUiInformation();
        this.scene.launch(SceneName.HUD);

        this.monsterSpawner.spawn(new ExplorationMap());
        this.itemSpawner.spawn(new ExplorationMap());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(time: number, delta: number): void {
        this.eventRegistry.update(time, delta);
        // Update collision registry.
        this.collisionDetectionManager.update(time, delta);
        // Update player position.
        this.player.update(delta);
        this.gameObjectRegistry.getObjects().forEach(obj => {
            obj.update(time);
        });
        this.uiService.update();
    }

    onShutdown() {}

    private launchMenu() {
        this.scene.pause(SceneName.EXPLORATION, { test: 'hallo' });
        this.scene.launch(SceneName.OVERLAY_MENU);
    }
}
