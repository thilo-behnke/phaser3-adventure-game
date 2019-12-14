import {BaseGameObject} from './BaseGameObject';
import {CollisionGroupDef} from "../collision/CollisionGroupDef";
import {CollisionGroup} from "../collision/CollisionGroup";

export enum MonsterType {
    WOLF = 'WOLF',
    SHEEP = 'SHEEP'
}

export const NUMBER_OF_MONSTERS = Object.keys(MonsterType).length;

export type MonsterStats = {
    health: number;
    strength: number;
    agility: number;
};

@CollisionGroupDef(CollisionGroup.PLAYER)
export class MonsterObject extends BaseGameObject {
    private type: MonsterType;
    private stats: MonsterStats;

    constructor(id: string, stats: MonsterStats, type: MonsterType) {
        super(id);
        this.type = type;
        this.stats = stats;
    }

    update = (delta: number) => {};

    getStats = () => this.stats;
}
