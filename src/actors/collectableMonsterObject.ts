import {BaseGameObject} from './baseGameObject';
import {CollisionGroupDef} from "../collision/CollisionGroupDef";
import {CollisionGroup} from "../collision/CollisionGroup";

export enum Monster {
    WOLF = 'WOLF',
}

export type MonsterStats = {
    type: Monster;

    health: number;
    strength: number;
    agility: number;
};

@CollisionGroupDef(CollisionGroup.PLAYER)
export class CollectableMonsterObject extends BaseGameObject {
    private stats: MonsterStats;

    static generate = (id: number, stats: MonsterStats) => {
        const monster = new CollectableMonsterObject(stats.type);
        monster.stats = stats;
        return monster;
    };

    update = (delta: number) => {};

    getStats = () => this.stats;
}
