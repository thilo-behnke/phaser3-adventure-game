import { IGameObjectFactory } from './IGameObjectFactory';
import { MonsterObject, MonsterStats, MonsterType } from '../actors/MonsterObject';
import { singleton } from 'tsyringe';

import * as wolfTemplate from '../../assets/data/monsters/wolf.json';
import * as sheepTemplate from '../../assets/data/monsters/sheep.json';
import { generateUUID } from '../util/random';

type MonsterTemplate = {
    type: MonsterType;
    baseStats: MonsterStats;
    rarity: number;
};

@singleton()
export class MonsterFactory implements IGameObjectFactory<MonsterObject> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getMonsterByRarity(rarity: number, seed: string): MonsterTemplate {
        const allMonsters = [wolfTemplate, sheepTemplate];
        const monstersForRarityLevel = allMonsters.filter(
            ({ rarity: mRarity }) => mRarity === rarity
        );
        if (!monstersForRarityLevel.length) {
            throw new Error(
                `No monster available for rarity level ${rarity}! Unable to spawn monster.`
            );
        }
        // Determine the monster.
        return monstersForRarityLevel[parseInt(seed, 16) % monstersForRarityLevel.length];
    }

    generateObject(rarity: number): MonsterObject {
        const seed = generateUUID();
        const monsterTemplate = this.getMonsterByRarity(rarity, seed);
        return new MonsterObject(generateUUID(), monsterTemplate.baseStats, monsterTemplate.type);
    }
}
