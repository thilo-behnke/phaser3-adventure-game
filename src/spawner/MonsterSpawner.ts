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
import { getRandomNumberBetween } from '../util/random';
import { RNGService } from '../util/RNGService';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';

@autoInjectable()
export class MonsterSpawner extends GameObjectSpawner {
    constructor(
        sceneProvider?: SceneProvider,
        collisionDetectionManager?: CollisionDetectionManager,
        gameObjectRegistry?: GameObjectRegistry,
        private monsterFactory?: MonsterFactory,
        private rngService?: RNGService
    ) {
        super(sceneProvider, collisionDetectionManager, gameObjectRegistry);
    }

    // TODO: Evaluate map, determine monster positions...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    generateSpawns = (map: ExplorationMap): Array<[Point, BaseGameObject]> => {
        return range(10)
            .map(() => {
                const [x, y] = this.sceneProvider.getMapDimensions();
                return [getRandomNumberBetween(0, x), getRandomNumberBetween(0, y)];
            })
            .map(([x, y]) => {
                const rarity = x % 2 === 0 ? 20 : 10;
                const obj = this.monsterFactory.generateObject(rarity);
                return [new Point(x, y), obj];
            });
    };
}
