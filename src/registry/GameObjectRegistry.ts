import { BaseGameObject } from '../actors/BaseGameObject';
import { singleton } from 'tsyringe';
import { CollisionGroup } from '../collision/CollisionGroup';
import { COLLISION_GROUP_PROP } from '../collision/CollisionGroupDef';
import { Player } from '../actors/player';

@singleton()
export class GameObjectRegistry {
    private registry: { [key: string]: BaseGameObject } = {};
    private player: Player;

    setPlayer(player: Player) {
        this.player = player;
    }

    add(id: string, obj: BaseGameObject) {
        this.registry[id] = obj;
    }

    getByCollisionGroup(collisionGroup: CollisionGroup) {
        if (collisionGroup === CollisionGroup.PLAYER) {
            return [this.player];
        }
        return Object.values(this.registry).filter(gameObject => {
            const group =
                COLLISION_GROUP_PROP in gameObject
                    ? gameObject['collisionGroup']
                    : null;
            return group && group === collisionGroup;
        });
    }
}
