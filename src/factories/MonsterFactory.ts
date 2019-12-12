import {
    CollectableMonsterObject,
    Monster,
} from '../actors/collectableMonsterObject';
import { NUMBER_OF_MONSTERS } from '../constants';
import Point = Phaser.Geom.Point;
import {IMonsterGenerator} from "./IMonsterGenerator";
import Scene = Phaser.Scene;

export class MonsterFactory {

    private registry: {[key: number]: CollectableMonsterObject};

    constructor(private scene: Phaser.Scene){}

    generateMonsterBySeed = (generator: IMonsterGenerator) => {
        // Determine the monster.
        // TODO: Implement.
        const seed = generator.getSeed();
        const mod = seed % NUMBER_OF_MONSTERS;
        const stats = {
            type: Monster.WOLF,
            health: 100,
            strength: 100,
            agility: 100,
        };
        this.registry[seed] = CollectableMonsterObject.generate(this.scene, stats);
        return seed;
    };

    addToScene(id: number, pos: Point) {
        const monster = this.registry[id];
        if(!monster) {
            throw new Error(`Monster with id ${id} not found!`)
        }
        const sprite = this.scene.add.sprite(pos.x, pos.y, monster.type);
        monster.setSprite(sprite);
    }
}
