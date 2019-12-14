import { ItemObject, NUMBER_OF_ITEMS } from '../actors/items/ItemObject';

import { IGameObjectFactory } from './IGameObjectFactory';
import { injectable } from 'tsyringe';
import { Capsule } from '../actors/items/Capsule';

@injectable()
export class ItemFactory implements IGameObjectFactory<ItemObject> {
    generateObject(seed: number): ItemObject {
        const mod = seed % NUMBER_OF_ITEMS;
        return new Capsule(seed.toString(), mod);
    }
}
