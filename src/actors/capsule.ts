import { ItemObject } from './item';
import Point = Phaser.Geom.Point;
import { NUMBER_OF_MONSTERS } from '../constants';

export class Capsule extends ItemObject {
    private seed: number;

    static create = (scene: Phaser.Scene, pos: Point) => {
        // TODO: Think of more complex mechanism.
        const seed = Date.now();
        const capsule = new Capsule('capsule--' + seed);
        capsule.seed = seed;
        capsule.sprite = scene.physics.add.sprite(pos.x, pos.y, 'player');
        return capsule;
    };

    getSeed = () => {
        return this.seed;
    };

    update: (delta: number) => void;
}
