import { autoInjectable } from 'tsyringe';
import { ItemObject } from '../actors/items/ItemObject';
import { MonsterObject } from '../actors/MonsterObject';
import { Capsule } from '../actors/items/Capsule';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MonsterSpawner } from '../spawner/MonsterSpawner';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { EventRegistry, EventType } from '../event/EventRegistry';

type ItemStorage = { [id: string]: ItemObject };

@autoInjectable()
export class Inventory {
    // TODO: This should be subject to change.
    private _inventoryDef = {
        capsules: 3,
    };

    private items: ItemStorage = {};
    private itemSubject = new BehaviorSubject<ItemStorage>(this.items);
    private monsters: { [id: string]: MonsterObject } = {};

    constructor(
        private monsterSpawner?: MonsterSpawner,
        private gameObjectRegistry?: GameObjectRegistry,
        private eventRegistry?: EventRegistry
    ) {}

    get inventoryDef(): { capsules: number } {
        return this._inventoryDef;
    }

    add(item: ItemObject): void {
        this.items[item.id] = item;
        this.itemSubject.next(this.items);
        console.log('Inventory was updated: ', this.items);
        this.eventRegistry.register({
            type: EventType.ITEM_PICKED_UP,
            by: this.gameObjectRegistry.getPlayer(),
            item,
        });
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
            monster.caught = true;
            this.monsters[monster.id] = monster;
            this.remove(item.id);
            this.monsterSpawner.addToScene(this.gameObjectRegistry.getPlayerPos(), monster);
            console.log(
                'Capsule was opened, monster added to inventory',
                this.items,
                this.monsters
            );
            this.eventRegistry.register({
                type: EventType.ITEM_PICKED_UP,
                by: this.gameObjectRegistry.getPlayer(),
                item,
            });
        }
    }
}
