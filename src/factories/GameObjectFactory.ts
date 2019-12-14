import { IGameObjectFactory } from './IGameObjectFactory';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import Point = Phaser.Geom.Point;
import { SceneProvider } from '../scene/SceneProvider';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { BaseGameObject } from '../actors/BaseGameObject';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';

export abstract class GameObjectFactory<T extends BaseGameObject>
    implements IGameObjectFactory {
    private registry: { [key: number]: T } = {};

    protected constructor(
        protected sceneProvider: SceneProvider,
        protected collisionDetectionManager: CollisionDetectionManager,
        protected gameObjectRegistry: GameObjectRegistry
    ) {}

    protected abstract generateObject(seed: number): T;

    addToScene(pos: Point, seed: number) {
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
