import { singleton } from 'tsyringe';

import { COLLISION_GROUP_PROP } from './CollisionGroupDef';
import { SceneProvider } from '../scene/SceneProvider';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { BaseGameObject } from '../actors/BaseGameObject';
import { ItemObject } from '../actors/items/ItemObject';
import { Player } from '../actors/Player';
import { MonsterObject } from '../actors/MonsterObject';
import { tileCollider } from '../util/collision';
import { CollisionGroup, CollisionType } from './CollisionGroup';
import { Updatable } from '../shared/Updatable';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Tile = Phaser.Tilemaps.Tile;

@singleton()
export class CollisionDetectionManager implements Updatable {
    private collisionRegistry: Array<[string, string]> = [];
    private tempCollisionRegistry: Array<[string, string]> = [];

    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry
    ) {}

    private getCallback = (obj: BaseGameObject, obj2: BaseGameObject): Function => {
        if (obj instanceof ItemObject && obj2 instanceof Player) {
            return obj.handlePlayerCollision;
        } else if (
            (obj instanceof MonsterObject && obj2 instanceof MonsterObject) ||
            obj2 instanceof Player
        ) {
            return (objA, objB) => {
                this.tempCollisionRegistry.push([objA.name, objB.name]);
                return (() => {})();
            };
        }
        return console.log;
    };

    register = (gameObject: BaseGameObject): void => {
        const collisionGroups: Array<[CollisionGroup, CollisionType]> =
            COLLISION_GROUP_PROP in gameObject ? gameObject['collisionGroup'] : null;
        if (!collisionGroups) {
            throw new Error(
                "Can't register collision for obj " + gameObject.id + ' without a collision group!'
            );
        }
        // Set collisions with other sprite objects.
        // TODO: Collisions are registered (callback is triggered), but it does not work for monsters.
        collisionGroups.forEach(([collisionGroup, collisionType]) => {
            const toRegister = this.gameObjectRegistry.getByCollisionGroup(collisionGroup);
            toRegister.forEach(obj => {
                if (obj.id === gameObject.id) {
                    return;
                }
                const callback = this.getCallback(gameObject, obj);
                this.sceneProvider.addCollisionByType(gameObject, obj, callback, collisionType);
            });
        });

        if (gameObject instanceof MonsterObject) {
            // Set collision with with ground (colliding tiles).
            this.sceneProvider.addCollisionWithGround(gameObject, (objA: Sprite, objB: Tile) => {
                const gameObject = this.gameObjectRegistry.getById(objA.name);
                if (gameObject.isEmpty()) {
                    return;
                }
                return tileCollider(gameObject.value, objB);
            });
            // Set collision with world bounds.
            gameObject.sprite.setCollideWorldBounds(true);
        }
    };

    update = (time: number, delta: number) => {
        this.collisionRegistry = [...this.tempCollisionRegistry];
        this.tempCollisionRegistry = [];
    };

    isCollidingWith = (objA: BaseGameObject, objB: BaseGameObject) => {
        const objACollisions = this.collisionRegistry
            .filter(([a, b]) => objA.id === a || objA.id === b)
            .map(([a, b]) => (a === objA.id ? b : a));
        return !!objACollisions?.some(objFromRegistry => objB.id === objFromRegistry);
    };
}
