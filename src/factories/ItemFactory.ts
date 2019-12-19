import {
    ItemObject,
    MAX_ITEM_RARITY,
    NUMBER_OF_ITEMS,
} from '../actors/items/ItemObject';

import { IGameObjectFactory } from './IGameObjectFactory';
import { injectable } from 'tsyringe';
import { Capsule } from '../actors/items/Capsule';
import { generateUUID } from '../util/random';

@injectable()
export class ItemFactory implements IGameObjectFactory<ItemObject> {
    generateObject(rarity: number): ItemObject {
        // TODO: Remove hard coding...
        const mod = 20;
        if (rarity) {
            // TODO: Implement generation...
        }
        return new Capsule(generateUUID(), mod);
    }
}
