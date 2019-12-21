import 'phaser';
import * as player from '../../assets/graphics/green-knight.png';
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
import { MonsterObject } from '../actors/MonsterObject';
import { Color } from '../shared/constants';
import Point = Phaser.Geom.Point;

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
        this.load.spritesheet('player', player, {
            frameWidth: 20,
            frameHeight: 29,
        });
        // TODO: Replace with proper spritesheet.
        this.load.spritesheet('WOLF', player, {
            frameWidth: 20,
            frameHeight: 29,
        });
        this.load.image('CAPSULE', 'assets/CAPSULE.png');
        this.load.image('CAPSULE_INACTIVE', 'assets/CAPSULE_INACTIVE.png');
    }

    create(): void {
        // TODO: Why does constructor autowiring not work here?
        this.sceneProvider = container.resolve(SceneProvider);
        this.sceneProvider.initialize(this);
        this.debugService = container.resolve(DebugService);
        this.gameObjectRegistry = container.resolve(GameObjectRegistry);
        this.keyManager = container.resolve(KeyManager);
        this.player = Player.create(this, new Point(100, 100));
        this.gameObjectRegistry.setPlayer(this.player);
        this.monsterSpawner = container.resolve(MonsterSpawner);
        this.itemSpawner = container.resolve(ItemSpawner);
        this.inventory = container.resolve(Inventory);

        this.monsterSpawner.spawn(new ExplorationMap());
        this.itemSpawner.spawn(new ExplorationMap());

        // Initialize Ui Elements
        this.inventoryUi = container.resolve(InventoryUi);
        // Initialize Controls
        this.keyManager.assignAction(Action.INVENTORY, () => this.inventoryUi.toggle());
        // Debugging.
        this.debugService.showGrid();
        this.debugService.showPlayerPos();
        const monster = this.gameObjectRegistry.getObjects()[0];
        this.debugService.showObjectPos(monster.id);
        // TODO: Does not work when new monsters are spawned.
        this.gameObjectRegistry.getMonsters().forEach(this.drawAttentionRadius);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(time: number, delta: number): void {
        // Update player position.
        this.player.update(delta);
        this.gameObjectRegistry.getObjects().forEach(obj => obj.update(time));
        this.debugService.update();
    }

    private drawAttentionRadius = (monster: MonsterObject) => {
        this.debugService.drawShapeFromObject(monster.id, (obj: MonsterObject) =>
            this.debugService.drawCircle(
                obj.sprite.getCenter(),
                obj.getStats().attentionRadius,
                Color.BLACK,
                0.2
            )
        );
    };
}
