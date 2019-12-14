import Point = Phaser.Geom.Point;
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { SceneProvider } from '../scene/SceneProvider';
import { IGameObjectFactory } from './IGameObjectFactory';
import { BaseGameObject } from '../actors/BaseGameObject';

export abstract class GameObjectFactory<T extends BaseGameObject>
    implements IGameObjectFactory {
    private registry: { [key: number]: T } = {};

    protected constructor(
        protected sceneProvider: SceneProvider,
        protected collisionDetectionManager: CollisionDetectionManager,
        protected gameObjectRegistry: GameObjectRegistry
    ) {}

    protected abstract generateObject(seed: number): T;

    addToScene(pos: Point, seed: number): void {
        const obj = this.generateObject(seed),
            id = obj.id;

        this.gameObjectRegistry.add(id, obj);
        this.registry[id] = obj;
        if (!obj) {
            throw new Error(`GameObject with id ${id} not found!`);
        }
        this.sceneProvider.addToScene(obj, pos);
        this.collisionDetectionManager.register(obj);
    }
}
