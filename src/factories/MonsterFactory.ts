import { IGameObjectFactory } from './IGameObjectFactory';
import { MonsterObject, MonsterStats, MonsterType } from '../actors/MonsterObject';
import { singleton } from 'tsyringe';

import * as wolfTemplate from '../../assets/data/monsters/wolf.json';
import * as blobTemplate from '../../assets/data/monsters/blob.json';
import { generateUUID } from '../util/random';
import { SceneProvider } from '../scene/SceneProvider';
import { Direction } from '../shared/direction';
import GenerateFrameNames = Phaser.Types.Animations.GenerateFrameNames;

type MonsterTemplate = {
    type: MonsterType;
    baseStats: MonsterStats;
    rarity: number;
};

@singleton()
export class MonsterFactory implements IGameObjectFactory<MonsterObject> {
    private animDesc: Array<[Direction, GenerateFrameNames]> = [
        [Direction.DOWN, { start: 0, end: 1 }],
        [Direction.UP, { start: 2, end: 3 }],
        [Direction.LEFT, { start: 4, end: 5 }],
        [Direction.RIGHT, { start: 6, end: 7 }],
    ];

    private animsLoaded: { [key: string]: boolean } = {};
    constructor(private sceneProvider: SceneProvider) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getMonsterByRarity(rarity: number, seed: string): MonsterTemplate {
        const allMonsters = [wolfTemplate, blobTemplate];
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
        if (!this.animsLoaded[monsterTemplate.type] && monsterTemplate.type === MonsterType.BLOB) {
            this.animDesc.forEach(([direction, config]) => {
                return this.sceneProvider.createAnim({
                    key: `${monsterTemplate.type}-WALKING--${direction}`,
                    frames: this.sceneProvider.generateFrameNames(
                        `${monsterTemplate.type}`,
                        config
                    ),
                    frameRate: 3,
                    repeat: -1,
                });
            });
            this.animsLoaded[monsterTemplate.type] = true;
        }
        return new MonsterObject(generateUUID(), monsterTemplate.baseStats, monsterTemplate.type);
    }
}
