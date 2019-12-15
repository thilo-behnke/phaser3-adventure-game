import { injectable, singleton } from 'tsyringe';

import { COLLISION_GROUP_PROP } from './CollisionGroupDef';
import { SceneProvider } from '../scene/SceneProvider';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { BaseGameObject } from '../actors/BaseGameObject';
import { Inventory } from '../inventory/Inventory';
import { ItemObject } from '../actors/items/ItemObject';
import { Player } from '../actors/Player';

@singleton()
@injectable()
export class CollisionDetectionManager {
    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry,
        private inventory: Inventory
    ) {}

    private getCallback = (
        obj: BaseGameObject,
        obj2: BaseGameObject
    ): Function => {
        if (obj instanceof ItemObject && obj2 instanceof Player) {
            return (): void => {
                console.log('Player picked up item: ', obj);
                this.inventory.add(obj);
                obj.destroySprite();
            };
        }
        return console.log;
    };

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
            const callback = this.getCallback(gameObject, obj);
            this.sceneProvider.addCollider(gameObject, obj, callback);
        });
    };
}
