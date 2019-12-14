import { injectable, singleton } from 'tsyringe';
import Scene = Phaser.Scene;
import { BaseGameObject } from '../actors/BaseGameObject';
import Point = Phaser.Geom.Point;
import { CollisionGroup } from '../collision/CollisionGroup';

@singleton()
@injectable()
export class SceneProvider {
    private scene: Scene;

    initialize = (scene: Phaser.Scene) => {
        this.scene = scene;
    };

    addToScene = (obj: BaseGameObject, pos: Point) => {
        const sprite = this.scene.physics.add.sprite(
            pos.x,
            pos.y,
            obj.id.toString()
        );
        obj.setSprite(sprite);
        return obj;
    };

    addCollider = (obj: BaseGameObject, obj2: BaseGameObject, onCollide) => {
        return this.scene.physics.add.collider(
            obj.getSprite(),
            obj2.getSprite(),
            onCollide
        );
    };

    addKey = (keyCode: number) => {
        return this.scene.input.keyboard.addKey(keyCode);
    };
}
