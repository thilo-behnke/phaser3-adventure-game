import Point = Phaser.Geom.Point;

import { injectable } from 'tsyringe';
import { ItemFactory } from '../factories/ItemFactory';
import { ExplorationMap } from '../map/ExplorationMap';
import { GameObjectSpawner } from './GameObjectSpawner';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { SceneProvider } from '../scene/SceneProvider';
import { BaseGameObject } from '../actors/BaseGameObject';

@injectable()
export class ItemSpawner extends GameObjectSpawner {
    constructor(
        sceneProvider: SceneProvider,
        collisionDetectionManager: CollisionDetectionManager,
        gameObjectRegistry: GameObjectRegistry,
        private itemFactory: ItemFactory
    ) {
        super(sceneProvider, collisionDetectionManager, gameObjectRegistry);
    }

    // TODO: Evaluate map, determine item positions...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateSpawns = (map: ExplorationMap): Array<[Point, BaseGameObject]> => {
        const seed = Date.now();
        const obj = this.itemFactory.generateObject(seed);
        return [[new Point(400, 200), obj]];
    };
}
