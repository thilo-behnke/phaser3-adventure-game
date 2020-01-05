import { container } from 'tsyringe';
import { Inventory } from './Inventory';
import { SceneProvider } from '../scene/SceneProvider';
import { range } from 'lodash';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';
import { GameScene } from '../scenes/GameScene';
import Image = Phaser.GameObjects.Image;
import { tap } from 'rxjs/internal/operators';

export class InventoryScene extends Phaser.Scene implements GameScene {
    private CAPSULE_WIDTH = 40;
    private CAPSULE_HEIGHT = 88;
    private CAPSULE_PADDING_HOR = 10;
    private CAPSULE_PADDING_VER = 10;
    private INVENTORY_START_POS_VER;
    private INVENTORY_START_POS_HOR;

    private renderedInventory = [];
    private inventoryItems = {};

    private inventory: Inventory;
    private sceneProvider: SceneProvider;

    private subscriptions = [];

    create() {
        this.inventory = container.resolve(Inventory);
        this.sceneProvider = container.resolve(SceneProvider);
        /*        this.events.on('resume', this.onResume);*/

        this.INVENTORY_START_POS_HOR =
            SCREEN_WIDTH -
            this.inventory.inventoryDef.capsules * (this.CAPSULE_WIDTH + this.CAPSULE_PADDING_HOR);
        this.INVENTORY_START_POS_VER =
            SCREEN_HEIGHT - this.CAPSULE_HEIGHT + this.CAPSULE_PADDING_VER;

        const inventoryItemSubscription = this.inventory
            .getItems()
            .pipe(
                tap(items => {
                    this.inventoryItems = items;
                    this.renderInventory();
                })
            )
            .subscribe();

        this.subscriptions.push(inventoryItemSubscription);
    }

    onShutdown = () => {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    };

    private renderInventory = (): void => {
        this.destroyInventory();
        Object.entries(this.inventoryItems).forEach(([id], i) => {
            const image = this.createCapsuleImg(
                this.INVENTORY_START_POS_HOR + i * (this.CAPSULE_WIDTH + this.CAPSULE_PADDING_HOR),
                this.INVENTORY_START_POS_VER,
                true
            );
            image.setInteractive();
            image.on('pointerdown', () => this.inventory.use(id));
        });
        range(
            this.inventory.inventoryDef.capsules - Object.keys(this.inventoryItems).length
        ).forEach((emptyItem, i) => {
            this.createCapsuleImg(
                this.INVENTORY_START_POS_HOR +
                    (Object.keys(this.inventoryItems).length + i) *
                        (this.CAPSULE_WIDTH + this.CAPSULE_PADDING_HOR),
                this.INVENTORY_START_POS_VER
            );
        });
    };

    private destroyInventory = (): void => {
        // Delete old inventory, rerender (inefficient?).
        this.renderedInventory.forEach(image => image.destroy());
    };

    private createCapsuleImg = (x: number, y: number, active = false): Image => {
        const image = this.add.image(
            x,
            y,
            active ? 'CAPSULE_INVENTORY' : 'CAPSULE_INVENTORY_INACTIVE'
        );
        this.renderedInventory.push(image);
        return image;
    };
}
