import { injectable, singleton } from 'tsyringe';

import { COLLISION_GROUP_PROP, COLLISION_TYPE_PROP } from './CollisionGroupDef';
import { SceneProvider } from '../scene/SceneProvider';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { BaseGameObject } from '../actors/BaseGameObject';
import { ItemObject } from '../actors/items/ItemObject';
import { Player } from '../actors/Player';
import { MonsterObject } from '../actors/MonsterObject';

@singleton()
@injectable()
export class CollisionDetectionManager {
    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry
    ) {}

    private getCallback = (obj: BaseGameObject, obj2: BaseGameObject): Function => {
        if (obj instanceof ItemObject && obj2 instanceof Player) {
            return obj.handlePlayerCollision;
        }
        return () => {};
    };

    register = (gameObject: BaseGameObject): void => {
        const collisionGroup =
            COLLISION_GROUP_PROP in gameObject ? gameObject['collisionGroup'] : null;
        if (!collisionGroup) {
            throw new Error(
                "Can't register collision for obj " + gameObject.id + ' without a collision group!'
            );
        }
        const collisionType =
            COLLISION_TYPE_PROP in gameObject ? gameObject['collisionType'] : null;
        if (!collisionType) {
            throw new Error(
                "Can't register collision for obj " +
                    gameObject.id +
                    ' without a collision type (collide, overlap)!'
            );
        }
        // Set collisions with other sprite objects.
        const otherObjects = this.gameObjectRegistry.getByCollisionGroup(collisionGroup);
        otherObjects.forEach(obj => {
            const callback = this.getCallback(gameObject, obj);
            this.sceneProvider.addCollisionByType(gameObject, obj, callback, collisionType);
        });
        // Set collision with world bounds.
        if (gameObject instanceof MonsterObject) {
            gameObject.sprite.setCollideWorldBounds(true);
        }
    };
}
