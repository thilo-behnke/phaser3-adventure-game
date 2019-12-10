import { ItemObject } from './item';
import Point = Phaser.Geom.Point;
import { NUMBER_OF_MONSTERS } from '../constants';

export class Capsule extends ItemObject {
    private seed: number;

    static create = (scene: Phaser.Scene, initialPos: Point) => {
        const seed = Date.now();
        const capsule = new Capsule(scene, 'capsule--' + seed);
        capsule.seed = seed;
    };

    onPickup = () => {};
    onUse = () => {
        // TODO: How to notify factory to create the monster?
    };
    update: (delta: number) => void;
}
