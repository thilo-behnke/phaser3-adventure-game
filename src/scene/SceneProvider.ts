import { singleton } from 'tsyringe';
import { BaseGameObject } from '../actors/BaseGameObject';
import { CollisionType } from '../collision/CollisionGroup';
import Scene = Phaser.Scene;

import Point = Phaser.Geom.Point;

import Collider = Phaser.Physics.Arcade.Collider;
import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;
import { Vector } from 'phaser/types/matter';
import { Color } from '../shared/constants';

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

    addCircle = (x: number, y: number, radius: number, color = Color.BLACK, alpha = 1) => {
        return this.scene.add.circle(x, y, radius, color, alpha);
    };

    addVector = (from: Vector2, to: Vector2) => {
        return this.scene.add.line(0, 0, from.x, from.y, to.x, to.y, 44).setOrigin(0, 0);
    };

    addLine = (from: Vector2, to: Vector2, color = Color.BLACK, alpha = 1) => {
        return this.scene.add.line(0, 0, from.x, from.y, to.x, to.y, color, alpha).setOrigin(0, 0);
    };

    addText = (x: number, y: number, text: string, fontColor = Color.WHITE, fontSize = 12) => {
        return this.scene.add.text(x, y, text, { fontColor, fontSize });
    };

    addGrid = (width: number, height: number, gridHor: number, gridVer: number) => {
        return this.scene.add.grid(0, 0, width, height, gridHor, gridVer);
    };
}
