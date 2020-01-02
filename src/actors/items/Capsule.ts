import { CollisionGroup, CollisionType } from '../../collision/CollisionGroup';
import { CollisionGroupDef } from '../../collision/CollisionGroupDef';
import { ItemObject, ItemType } from './ItemObject';
import { MonsterFactory } from '../../factories/MonsterFactory';
import { MonsterObject } from '../MonsterObject';
import { container } from 'tsyringe';
import { Inventory } from '../../inventory/Inventory';

@CollisionGroupDef([CollisionGroup.PLAYER, CollisionType.OVERLAP])
export class Capsule extends ItemObject {
    protected _type = ItemType.CAPSULE;
    private rarity: number;

    constructor(id: string, rarity: number) {
        super(id);
        this.rarity = rarity;
    }

    open = (): MonsterObject => {
        const monsterFactory = container.resolve(MonsterFactory);
        return monsterFactory.generateObject(this.rarity);
    };

    handlePlayerCollision = (): void => {
        const inventory = container.resolve(Inventory);
        inventory.add(this);
        this.destroySprite();
    };
}
