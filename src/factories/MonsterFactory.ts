import { GameObjectFactory } from './GameObjectFactory';
import {
    MonsterObject,
    MonsterStats,
    MonsterType,
    NUMBER_OF_MONSTERS,
} from '../actors/MonsterObject';
import { injectable } from 'tsyringe';

import * as wolfTemplate from '../../assets/data/monsters/wolf.json';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { SceneProvider } from '../scene/SceneProvider';

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getMonsterBySeed(n: number): MonsterTemplate {
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
