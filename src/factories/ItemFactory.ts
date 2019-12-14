import { IGameObjectFactory } from './IGameObjectFactory';
import {
    ItemObject,
    ItemStats,
    ItemType,
    NUMBER_OF_ITEMS,
} from '../actors/ItemObject';

import * as capsuleTemplate from '../../assets/data/items/capsule.json';
import { MonsterObject } from '../actors/MonsterObject';
import { GameObjectFactory } from './GameObjectFactory';
import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';

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

    private getItemBySeed(n: number) {
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
