import { ExplorationMap } from '../map/ExplorationMap';
import Point = Phaser.Geom.Point;
import { BaseGameObject } from '../actors/BaseGameObject';
import { SceneProvider } from '../scene/SceneProvider';
import { CollisionDetectionManager } from '../collision/CollisionDetectionManager';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';

export abstract class GameObjectSpawner {
    protected constructor(
        protected sceneProvider: SceneProvider,
        protected collisionDetectionManager: CollisionDetectionManager,
        protected gameObjectRegistry: GameObjectRegistry
    ) {}

    protected abstract generateSpawns: (
        map: ExplorationMap
    ) => Array<[Point, BaseGameObject]>;

    spawn(map: ExplorationMap): void {
        const spawns: Array<[Point, BaseGameObject]> = this.generateSpawns(map);
        spawns.forEach(([pos, obj]) => this.addToScene(pos, obj));
    }

    addToScene(pos: Point, obj: BaseGameObject): void {
        const id = obj.id;

        this.gameObjectRegistry.add(id, obj);
        this.sceneProvider.addToScene(obj, pos);
        this.collisionDetectionManager.register(obj);
    }
}
