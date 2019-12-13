import {injectable, singleton} from "tsyringe";
import Scene = Phaser.Scene;
import {BaseGameObject} from "../actors/baseGameObject";
import Point = Phaser.Geom.Point;
import {CollisionGroup} from "../collision/CollisionGroup";


@singleton()
@injectable()
export class SceneProvider {

    private scene: Scene;

    initialize = (scene: Phaser.Scene) => {
        this.scene = scene;
    };

    addToScene = (obj: BaseGameObject, pos: Point) => {
        const sprite = this.scene.add.sprite(
            pos.x,
            pos.y,
            obj.id.toString()
        );
        obj.setSprite(sprite);
        return obj;
    }

    addCollider = (obj: BaseGameObject, group: CollisionGroup) => {
        // TODO: Condition?
        return this.scene.physics.add.collider(obj.getSprite(), null);
    }

}
