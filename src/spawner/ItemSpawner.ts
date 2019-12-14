import Point = Phaser.Geom.Point;

import { injectable } from 'tsyringe';
import { ItemFactory } from '../factories/ItemFactory';
import { ExplorationMap } from '../map/ExplorationMap';
import { IGameObjectSpawner } from './IGameObjectSpawner';

@injectable()
export class ItemSpawner implements IGameObjectSpawner {
    constructor(private itemFactory: ItemFactory) {}

    // TODO: Evaluate map, determine item positions...
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    spawn = (map: ExplorationMap): void => {
        const seed = Date.now();
        this.itemFactory.addToScene(new Point(400, 100), seed);
    };
}
