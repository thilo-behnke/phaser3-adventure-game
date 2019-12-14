import { IGameObjectSpawner } from './IGameObjectSpawner';
import { ExplorationMap } from '../map/ExplorationMap';
import Point = Phaser.Geom.Point;
import { ItemFactory } from '../factories/ItemFactory';
import { injectable } from 'tsyringe';

@injectable()
export class ItemSpawner implements IGameObjectSpawner {
    constructor(private itemFactory: ItemFactory) {}

    // TODO: Evaluate map, determine item positions...
    spawn = (map: ExplorationMap) => {
        const seed = Date.now();
        this.itemFactory.addToScene(new Point(400, 100), seed);
    };
}
