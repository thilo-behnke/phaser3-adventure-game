import {
    CollectableMonsterObject,
    Monster,
} from '../actors/collectableMonsterObject';
import { NUMBER_OF_MONSTERS } from '../constants';

export class MonsterFactory {
    constructor(private scene: Phaser.Scene) {}

    // TODO: Implement.
    generateMonsterBySeed = (seed: number) => {
        // Determine the monster.
        const mod = seed % NUMBER_OF_MONSTERS;
        const stats = {
            type: Monster.WOLF,
            health: 100,
            strength: 100,
            agility: 100,
        };
        const monster = CollectableMonsterObject.generate(this.scene, stats);
        return monster;
    };
}
