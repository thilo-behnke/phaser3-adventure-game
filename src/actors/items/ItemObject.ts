import { BaseGameObject } from '../BaseGameObject';

export enum ItemType {
    CAPSULE = 'CAPSULE',
}

export const NUMBER_OF_ITEMS = Object.keys(ItemType).length;

export abstract class ItemObject extends BaseGameObject {
    protected _type: ItemType;

    protected constructor(id: string) {
        super(id);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update = (delta: number): void => {
        return;
    };
}
