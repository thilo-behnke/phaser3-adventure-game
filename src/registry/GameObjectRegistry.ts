import { singleton } from 'tsyringe';
import { CollisionGroup } from '../collision/CollisionGroup';
import { COLLISION_GROUP_PROP } from '../collision/CollisionGroupDef';
import { BaseGameObject } from '../actors/BaseGameObject';
import { Player } from '../actors/Player';

@singleton()
export class GameObjectRegistry {
    private registry: { [key: string]: BaseGameObject } = {};
    private player: Player;

    setPlayer(player: Player): void {
        this.player = player;
    }

    add(id: string, obj: BaseGameObject): void {
        this.registry[id] = obj;
    }

    getByCollisionGroup(collisionGroup: CollisionGroup): BaseGameObject[] {
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
