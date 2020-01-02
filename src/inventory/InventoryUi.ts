import { autoInjectable, injectable } from 'tsyringe';
import { Inventory } from './Inventory';
import Scene = Phaser.Scene;
import { SceneProvider } from '../scene/SceneProvider';
import Image = Phaser.GameObjects.Image;
import { range } from 'lodash';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';

// TODO: This should better be a scene (overlay).
@autoInjectable()
export class InventoryUi {
    private readonly CAPSULE_WIDTH = 40;
    private readonly CAPSULE_HEIGHT = 88;
    private readonly CAPSULE_PADDING_HOR = 10;
    private readonly CAPSULE_PADDING_VER = 10;
    private readonly INVENTORY_START_POS_VER;
    private readonly INVENTORY_START_POS_HOR;

    private renderedInventory = [];
    private inventoryItems = {};

    private show = false;

    constructor(private inventory?: Inventory, private sceneProvider?: SceneProvider) {
        this.INVENTORY_START_POS_HOR =
            SCREEN_WIDTH -
            this.inventory.inventoryDef.capsules * (this.CAPSULE_WIDTH + this.CAPSULE_PADDING_HOR);
        this.INVENTORY_START_POS_VER =
            SCREEN_HEIGHT - this.CAPSULE_HEIGHT + this.CAPSULE_PADDING_VER;
        // Render inventory.
        this.inventory.getItems().subscribe(items => {
            this.inventoryItems = items;
            if (this.show) {
                this.renderInventory();
            }
        });
    }

    toggle = (): void => {
        if (this.show) {
            this.destroyInventory();
        } else {
            this.renderInventory();
        }
        this.show = !this.show;
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
        const image = this.sceneProvider.addImage(
            x,
            y,
            active ? 'CAPSULE_INVENTORY' : 'CAPSULE_INVENTORY_INACTIVE'
        );
        this.renderedInventory.push(image);
        return image;
    };
}
