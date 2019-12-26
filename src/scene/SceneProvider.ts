import { singleton } from 'tsyringe';
import { BaseGameObject } from '../actors/BaseGameObject';
import { CollisionType } from '../collision/CollisionGroup';
import Scene = Phaser.Scene;

import Point = Phaser.Geom.Point;

import Collider = Phaser.Physics.Arcade.Collider;
import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;
import { Vector } from 'phaser/types/matter';
import { Color, TILE_SIZE } from '../shared/constants';
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import { fromPairs } from 'lodash';
import { Optional } from '../util/fp';
import { cartesianProduct } from '../util/general';
import { segmentVector } from '../util/vector';
import Tile = Phaser.Tilemaps.Tile;

@singleton()
export class SceneProvider {
    private scene: Scene;
    private groundLayer: StaticTilemapLayer;
    private _collidingTilePositions: Vector2[];

    initialize = (scene: Phaser.Scene, groundLayer: StaticTilemapLayer): void => {
        this.scene = scene;
        this.groundLayer = groundLayer;
        const tiles = groundLayer.getTilesWithin();
        // Cache colliding tiles to make quick assumptions about navigating in the world.
        this._collidingTilePositions = tiles
            .filter(tile => !!tile.properties.collides)
            .map(({ x, y }) => new Vector2(x, y));
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

    addCollisionWithGround = (obj: BaseGameObject) => {
        // TODO: Player bounces from wall when colliding.
        this.scene.physics.add.collider(obj.sprite, this.groundLayer);
    };

    collidesTileInDirection = (pos: Vector2, dir: Vector2) => {
        return this.getTilesInDirection(pos, dir).ifPresent(
            ({ properties }) => !!properties.collides
        );
    };

    getTilesToGoal = (pos: Vector2, goal: Vector2) => {
        const direction = goal.clone().subtract(pos);
        const vectorSegments = segmentVector(pos, direction);
        return vectorSegments
            .map(this.getTileForPos)
            .filter(tile => !tile.isEmpty())
            .map(tile => tile.value);
    };

    getTilesInDirection = (pos: Vector2, dir: Vector2) => {
        const posInDir = pos.clone().add(dir.clone().scale(TILE_SIZE));
        const tilePos = this.getTileForPos(posInDir);
        return tilePos;
    };

    getAdjacentTilesFromPos = (pos: Vector2) => {
        const tileOpt = this.getTileForPos(pos);
        if (tileOpt.isEmpty()) {
            throw new Error(`No tile at position: ${pos}`);
        }
        const { x, y } = tileOpt.value;
        // TODO: This should be transferable to a function call (cross product?).
        const adjacentTilePositions = [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y],
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x + 1, y + 1],
            [x - 1, y - 1],
        ]
            .filter(([posX, posY]) => posX > 0 && posY > 0)
            .map(([posX, posY]) => new Vector2(posX, posY));
        return adjacentTilePositions
            .map(this.getTileForTilePos)
            .filter(tile => !tile.isEmpty())
            .map(tile => tile.value);
    };

    getTileForTilePos = (tilePos: Vector2) => {
        const tile = this.groundLayer.getTileAt(tilePos.x, tilePos.y);
        return Optional.of(tile);
    };

    getTileForPos = (pos: Vector2) => {
        const tile = this.groundLayer.getTileAtWorldXY(pos.x, pos.y);
        return Optional.of(tile);
    };

    getTilePosForPos = (pos: Vector2) => {
        const tileOpt = this.getTileForPos(pos);
        if (tileOpt.isEmpty()) {
            throw new Error(`No tile at pos ${pos}.`);
        }
        return new Vector2(tileOpt.value.x, tileOpt.value.y);
    };

    isCollidingTileForPos = (pos: Vector2) => {
        const tilePos = this.getTileForPos(pos).value;
        return this.collidingTilePositions.find(({ x, y }) => x === tilePos.x && y === tilePos.y);
    };

    isCollidingTile = (tilePos: Vector2) => {
        return this.collidingTilePositions.find(({ x, y }) => x === tilePos.x && y === tilePos.y);
    };

    get collidingTilePositions(): Phaser.Math.Vector2[] {
        return this._collidingTilePositions;
    }

    getTileCenter = (tile: Tile) => {
        return new Vector2(tile.pixelX + tile.baseWidth / 2, tile.pixelY + tile.baseHeight / 2);
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
