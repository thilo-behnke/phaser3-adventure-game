import { autoInjectable, injectable } from 'tsyringe';
import { range } from 'lodash';

import Point = Phaser.Geom.Point;
import { ExplorationMap } from '../map/ExplorationMap';
import { MonsterFactory } from '../factories/MonsterFactory';
import { GameObjectSpawner } from './GameObjectSpawner';
import { SceneProvider } from '../scene/SceneProvider';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { BaseGameObject } from '../actors/BaseGameObject';

@autoInjectable()
export class MonsterSpawner extends GameObjectSpawner {
    constructor(
        sceneProvider?: SceneProvider,
        collisionDetectionManager?: CollisionDetectionManager,
        gameObjectRegistry?: GameObjectRegistry,
        private monsterFactory?: MonsterFactory
    ) {
        super(sceneProvider, collisionDetectionManager, gameObjectRegistry);
    }

    // TODO: Evaluate map, determine monster positions...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateSpawns = (map: ExplorationMap): Array<[Point, BaseGameObject]> => {
        return [549, 600].map(i => {
            const rarity = i % 2 === 0 ? 20 : 10;
            const obj = this.monsterFactory.generateObject(rarity);
            return [new Point(i, i), obj];
        });
    };
}
