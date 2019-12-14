import { injectable, singleton } from 'tsyringe';

import { COLLISION_GROUP_PROP } from './CollisionGroupDef';
import { SceneProvider } from '../scene/SceneProvider';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { BaseGameObject } from '../actors/BaseGameObject';

@singleton()
@injectable()
export class CollisionDetectionManager {
    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry
    ) {}

    register = (gameObject: BaseGameObject): void => {
        const collisionGroup =
            COLLISION_GROUP_PROP in gameObject
                ? gameObject['collisionGroup']
                : null;
        if (!collisionGroup) {
            throw new Error(
                "Can't register collision for obj " +
                    gameObject.id +
                    ' without a collision group!'
            );
        }
        const otherObjects = this.gameObjectRegistry.getByCollisionGroup(
            collisionGroup
        );
        otherObjects.forEach(obj => {
            // TODO: Get the correct callback function for the collision (maybe from another service given the two objects? If so, this needs to be moved one level up.
            this.sceneProvider.addCollider(gameObject, obj, console.log);
        });
    };
}
