import { injectable, singleton } from 'tsyringe';
import Scene = Phaser.Scene;

import Point = Phaser.Geom.Point;

import Collider = Phaser.Physics.Arcade.Collider;
import Key = Phaser.Input.Keyboard.Key;
import { BaseGameObject } from '../actors/BaseGameObject';

@singleton()
@injectable()
export class SceneProvider {
    private scene: Scene;

    initialize = (scene: Phaser.Scene): void => {
        this.scene = scene;
    };

    addToScene = (obj: BaseGameObject, pos: Point): BaseGameObject => {
        const sprite = this.scene.physics.add.sprite(
            pos.x,
            pos.y,
            obj.id.toString()
        );
        obj.setSprite(sprite);
        return obj;
    };

    addCollider = (
        obj: BaseGameObject,
        obj2: BaseGameObject,
        onCollide
    ): Collider => {
        return this.scene.physics.add.collider(
            obj.getSprite(),
            obj2.getSprite(),
            onCollide
        );
    };

    addKey = (keyCode: number): Key => {
        return this.scene.input.keyboard.addKey(keyCode);
    };
}
