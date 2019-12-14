import {
    ItemObject,
    ItemStats,
    ItemType,
    NUMBER_OF_ITEMS,
} from '../actors/ItemObject';

import * as capsuleTemplate from '../../assets/data/items/capsule.json';

import { IGameObjectFactory } from './IGameObjectFactory';
import { injectable } from 'tsyringe';

type ItemTemplate = {
    type: ItemType;
    baseStats: ItemStats;
};

@injectable()
export class ItemFactory implements IGameObjectFactory<ItemObject> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getItemBySeed(n: number): ItemTemplate {
        // Determine the monster.
        // TODO: Implement random mechanism.
        return capsuleTemplate as ItemTemplate;
    }

    generateObject(seed: number): ItemObject {
        const mod = seed % NUMBER_OF_ITEMS;
        const itemTemplate = this.getItemBySeed(mod);
        return new ItemObject(
            seed.toString(),
            itemTemplate.baseStats,
            itemTemplate.type
        );
    }
}
