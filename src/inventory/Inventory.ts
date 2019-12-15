import { singleton } from 'tsyringe';
import { ItemObject } from '../actors/items/ItemObject';
import { MonsterObject } from '../actors/MonsterObject';
import { Capsule } from '../actors/items/Capsule';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

type ItemStorage = { [id: string]: ItemObject };

@singleton()
export class Inventory {
    private items: ItemStorage = {};
    private itemSubject = new BehaviorSubject<ItemStorage>(this.items);
    private monsters: { [id: string]: MonsterObject } = {};

    add(item: ItemObject): void {
        this.items[item.id] = item;
        this.itemSubject.next(this.items);
        console.log('Inventory was updated: ', this.items);
    }

    remove(id: string): void {
        delete this.items[id];
        this.itemSubject.next(this.items);
        console.log('Inventory was updated: ', this.items);
    }

    getItems(): Observable<ItemStorage> {
        return this.itemSubject.pipe(filter(val => val !== undefined));
    }

    use(itemId: string): void {
        const item = this.items[itemId];
        if (item instanceof Capsule) {
            const monster = item.open();
            this.monsters[monster.id] = monster;
            this.remove(item.id);
            console.log(
                'Capsule was opened, monster added to inventory',
                this.items,
                this.monsters
            );
        }
    }
}
