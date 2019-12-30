import { BaseGameObject } from '../BaseGameObject';
import { Inventory } from '../../inventory/Inventory';
import { container } from 'tsyringe';

export enum ItemType {
    CAPSULE = 'CAPSULE',
}

export const NUMBER_OF_ITEMS = Object.keys(ItemType).length;
export const MAX_ITEM_RARITY = 100;

export abstract class ItemObject extends BaseGameObject {
    protected _type: ItemType;

    protected constructor(id: string) {
        super(id);
    }

    preUpdate = () => {
        return;
    };

    afterUpdate = () => {
        return;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        return;
    };

    abstract handlePlayerCollision: () => void;

    onAddToScene = (): void => {
        return;
    };
}
