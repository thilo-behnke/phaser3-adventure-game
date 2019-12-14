import { CollisionGroup } from '../../collision/CollisionGroup';
import { CollisionGroupDef } from '../../collision/CollisionGroupDef';
import { ItemObject } from './ItemObject';
import { MonsterFactory } from '../../factories/MonsterFactory';
import { MonsterObject } from '../MonsterObject';
import { container } from 'tsyringe';

@CollisionGroupDef(CollisionGroup.PLAYER)
export class Capsule extends ItemObject {
    private rarity: number;

    constructor(id: string, rarity: number) {
        super(id);
        this.rarity = rarity;
    }

    open = (): MonsterObject => {
        const monsterFactory = container.resolve(MonsterFactory);
        return monsterFactory.generateObject(this.rarity);
    };
}
