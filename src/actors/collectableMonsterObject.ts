import { BaseGameObject } from './baseGameObject';
import Point = Phaser.Geom.Point;

export enum Monster {
    WOLF = 'WOLF',
}

export type MonsterStats = {
    type: Monster;

    health: number;
    strength: number;
    agility: number;
};

export class CollectableMonsterObject extends BaseGameObject {
    private stats: MonsterStats;

    static generate = (scene: Phaser.Scene, stats: MonsterStats) => {
        const monster = new CollectableMonsterObject(scene, stats.type);
        monster.stats = stats;
        return monster;
    };

    update = (delta: number) => {};
}
