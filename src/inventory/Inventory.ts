import { singleton } from 'tsyringe';
import { ItemObject } from '../actors/items/ItemObject';
import { MonsterObject } from '../actors/MonsterObject';
import { Capsule } from '../actors/items/Capsule';

@singleton()
export class Inventory {
    private items: { [id: string]: ItemObject } = {};
    private monsters: { [id: string]: MonsterObject } = {};

    add(item: ItemObject): void {
        this.items[item.id] = item;
        console.log('Inventory was updated: ', this.items);
    }

    remove(id: string): void {
        delete this.items[id];
        console.log('Inventory was updated: ', this.items);
    }

    use(itemId: string): void {
        const item = this.items[itemId];
        if (item instanceof Capsule) {
            const monster = item.open();
            this.monsters[monster.id] = monster;
            item.destroySprite();
            this.remove(item.id);
            console.log(
                'Capsule was opened, monster added to inventory',
                this.items,
                this.monsters
            );
        }
    }
}
