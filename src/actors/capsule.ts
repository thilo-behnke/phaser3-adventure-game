import { ItemObject } from './item';
import Point = Phaser.Geom.Point;
import { NUMBER_OF_MONSTERS } from '../constants';
import {IMonsterGenerator} from "../factories/IMonsterGenerator";

export class Capsule extends ItemObject implements IMonsterGenerator {
    private seed: number;

    static create = (scene: Phaser.Scene, pos: Point) => {
        // TODO: Think of more complex mechanism.
        const seed = Date.now();
        const capsule = new Capsule(scene, 'capsule--' + seed);
        capsule.seed = seed;
        capsule.sprite = scene.add.sprite(pos.x, pos.y, 'capsule');
        return capsule;
    };

    getSeed = () => {
        return this.seed;
    };

    update: (delta: number) => void;
}
