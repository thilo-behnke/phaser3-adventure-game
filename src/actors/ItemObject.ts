import {BaseGameObject} from './BaseGameObject';
import {CollisionGroupDef} from '../collision/CollisionGroupDef';
import {CollisionGroup} from '../collision/CollisionGroup';

export enum ItemType {
    CAPSULE = 'CAPSULE'
}

export type ItemStats = {
   rarity: number
}

export const NUMBER_OF_ITEMS = Object.keys(ItemType).length;

@CollisionGroupDef(CollisionGroup.PLAYER)
export class ItemObject extends BaseGameObject {
    private stats: ItemStats;

    constructor(id: string, stats: ItemStats, type: ItemType) {
        super(id);
        this.stats = stats;
    }

    update = (delta: number) => {};
}
