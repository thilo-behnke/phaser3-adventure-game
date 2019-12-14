import {IGameObjectSpawner} from "./IGameObjectSpawner";
import {ExplorationMap} from "../map/ExplorationMap";
import {injectable} from "tsyringe";
import {MonsterFactory} from "../factories/MonsterFactory";
import Point = Phaser.Geom.Point;

@injectable()
export class MonsterSpawner implements IGameObjectSpawner {
    constructor(private monsterFactory: MonsterFactory) {}

    // TODO: Evaluate map, determine monster positions...
    spawn = (map: ExplorationMap) => {
        const seed = Date.now();
        this.monsterFactory.addToScene(new Point(200, 200), seed)
    };
}
