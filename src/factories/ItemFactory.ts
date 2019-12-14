import {
    ItemObject,
    ItemStats,
    ItemType,
    NUMBER_OF_ITEMS,
} from '../actors/ItemObject';

import * as capsuleTemplate from '../../assets/data/items/capsule.json';

import { GameObjectFactory } from './GameObjectFactory';
import { injectable } from 'tsyringe';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { SceneProvider } from '../scene/SceneProvider';

type ItemTemplate = {
    type: ItemType;
    baseStats: ItemStats;
};

@injectable()
export class ItemFactory extends GameObjectFactory<ItemObject> {
    constructor(
        sceneProvider: SceneProvider,
        collisionDetectionManager: CollisionDetectionManager,
        gameObjectRegistry: GameObjectRegistry
    ) {
        super(sceneProvider, collisionDetectionManager, gameObjectRegistry);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getItemBySeed(n: number): ItemTemplate {
        // Determine the monster.
        // TODO: Implement random mechanism.
        return capsuleTemplate as ItemTemplate;
    }

    protected generateObject(seed: number): ItemObject {
        const mod = seed % NUMBER_OF_ITEMS;
        const itemTemplate = this.getItemBySeed(mod);
        return new ItemObject(
            seed.toString(),
            itemTemplate.baseStats,
            itemTemplate.type
        );
    }
}
