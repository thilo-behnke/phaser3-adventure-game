import { injectable } from 'tsyringe';

import Point = Phaser.Geom.Point;
import { ExplorationMap } from '../map/ExplorationMap';
import { MonsterFactory } from '../factories/MonsterFactory';
import { IGameObjectSpawner } from './IGameObjectSpawner';

@injectable()
export class MonsterSpawner implements IGameObjectSpawner {
    constructor(private monsterFactory: MonsterFactory) {}

    // TODO: Evaluate map, determine monster positions...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    spawn = (map: ExplorationMap): void => {
        const seed = Date.now();
        this.monsterFactory.addToScene(new Point(200, 200), seed);
    };
}
