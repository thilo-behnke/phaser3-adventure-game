import { singleton } from 'tsyringe';
import { BaseGameObject } from '../actors/BaseGameObject';
import { CollisionType } from '../collision/CollisionGroup';
import Scene = Phaser.Scene;

import Point = Phaser.Geom.Point;

import Collider = Phaser.Physics.Arcade.Collider;
import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;
import { Vector } from 'phaser/types/matter';

@singleton()
export class SceneProvider {
    private scene: Scene;

    initialize = (scene: Phaser.Scene): void => {
        this.scene = scene;
    };

    addToScene = (obj: BaseGameObject, pos: Point): BaseGameObject => {
        const sprite = this.scene.physics.add.sprite(pos.x, pos.y, obj.type);
        obj.setSprite(sprite);
        obj.sprite.setImmovable(true);
        obj.onAddToScene();
        return obj;
    };

    addCollisionByType = (
        obj: BaseGameObject,
        obj2: BaseGameObject,
        onCollide,
        type: CollisionType
    ): Collider => {
        const collisionFunc =
            type === CollisionType.OVERLAP
                ? this.scene.physics.add.overlap
                : this.scene.physics.add.collider;
        return collisionFunc.bind(this.scene.physics)(
            obj.sprite,
            obj2.sprite,
            onCollide,
            null,
            this.scene
        );
    };

    addKey = (keyCode: number): Key => {
        return this.scene.input.keyboard.addKey(keyCode);
    };

    addImage = (x: number, y: number, texture: string) => {
        return this.scene.add.image(x, y, texture);
    };

    addCircle = (x: number, y: number) => {
        return this.scene.add.circle(x, y, 2, 44);
    };

    addVector = (from: Vector2, to: Vector2) => {
        return this.scene.add.line(from.x, from.y, from.x, from.y, to.x, to.y, 44);
    };

    addText = (x: number, y: number, text: string) => {
        return this.scene.add.text(x, y, text);
    };
}
