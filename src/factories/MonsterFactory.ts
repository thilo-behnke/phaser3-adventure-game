import { GameObjectFactory } from './GameObjectFactory';
import {
    MonsterObject,
    MonsterType,
    MonsterStats,
    NUMBER_OF_MONSTERS,
} from '../actors/MonsterObject';
import { autoInjectable, injectable, singleton } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';

import * as wolfTemplate from '../../assets/data/monsters/wolf.json';

type MonsterTemplate = {
    type: MonsterType;
    baseStats: MonsterStats;
};

@injectable()
export class MonsterFactory extends GameObjectFactory<MonsterObject> {
    constructor(
        sceneProvider: SceneProvider,
        collisionDetectionManager: CollisionDetectionManager,
        gameObjectRegistry: GameObjectRegistry
    ) {
        super(sceneProvider, collisionDetectionManager, gameObjectRegistry);
    }

    private getMonsterBySeed(n: number) {
        // Determine the monster.
        // TODO: Implement random mechanism.
        return wolfTemplate as MonsterTemplate;
    }

    protected generateObject(seed: number): MonsterObject {
        const mod = seed % NUMBER_OF_MONSTERS;
        const monsterTemplate = this.getMonsterBySeed(mod);
        return new MonsterObject(
            seed.toString(),
            monsterTemplate.baseStats,
            monsterTemplate.type
        );
    }
}
