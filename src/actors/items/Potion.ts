import { ItemObject } from './ItemObject';
import { MonsterObject } from '../MonsterObject';

export class Potion extends ItemObject {
    private healAmount = 20;

    heal(monsterObj: MonsterObject): void {
        monsterObj.hp += this.healAmount;
    }

    handlePlayerCollision = (): void => {
        return;
    };
}
