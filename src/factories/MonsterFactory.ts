import { IGameObjectFactory } from './IGameObjectFactory';
import {
    MonsterObject,
    MonsterStats,
    MonsterType,
    NUMBER_OF_MONSTERS,
} from '../actors/MonsterObject';
import { injectable } from 'tsyringe';

import * as wolfTemplate from '../../assets/data/monsters/wolf.json';

type MonsterTemplate = {
    type: MonsterType;
    baseStats: MonsterStats;
};

@injectable()
export class MonsterFactory implements IGameObjectFactory<MonsterObject> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getMonsterBySeed(n: number): MonsterTemplate {
        // Determine the monster.
        // TODO: Implement random mechanism.
        return wolfTemplate as MonsterTemplate;
    }

    generateObject(seed: number): MonsterObject {
        const mod = seed % NUMBER_OF_MONSTERS;
        const monsterTemplate = this.getMonsterBySeed(mod);
        return new MonsterObject(
            seed.toString(),
            monsterTemplate.baseStats,
            monsterTemplate.type
        );
    }
}
