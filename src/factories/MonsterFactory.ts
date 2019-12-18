import { IGameObjectFactory } from './IGameObjectFactory';
import {
    MonsterObject,
    MonsterStats,
    MonsterType,
    NUMBER_OF_MONSTERS,
} from '../actors/MonsterObject';
import { singleton } from 'tsyringe';

import * as wolfTemplate from '../../assets/data/monsters/wolf.json';
import {generateUUID} from "../util/random";

type MonsterTemplate = {
    type: MonsterType;
    baseStats: MonsterStats;
};

@singleton()
export class MonsterFactory implements IGameObjectFactory<MonsterObject> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getMonsterBySeed(n: number): MonsterTemplate {
        // Determine the monster.
        // TODO: Implement random mechanism.
        return wolfTemplate as MonsterTemplate;
    }

    generateObject(rarity: number): MonsterObject {
        const mod = rarity % NUMBER_OF_MONSTERS;
        const monsterTemplate = this.getMonsterBySeed(mod);
        return new MonsterObject(
            generateUUID(),
            monsterTemplate.baseStats,
            monsterTemplate.type
        );
    }
}
