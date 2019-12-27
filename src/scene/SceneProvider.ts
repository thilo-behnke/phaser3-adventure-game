import { singleton } from 'tsyringe';
import { BaseGameObject } from '../actors/BaseGameObject';
import { CollisionType } from '../collision/CollisionGroup';
import { Color, TILE_SIZE } from '../shared/constants';
import { Optional } from '../util/fp';
import { getFirstSegmentOfVector, segmentVector } from '../util/vector';
import { TileVector, TileVectorSet } from '../global/TileVector';
import Scene = Phaser.Scene;

import Point = Phaser.Geom.Point;

import Collider = Phaser.Physics.Arcade.Collider;
import Key = Phaser.Input.Keyboard.Key;
import Vector2 = Phaser.Math.Vector2;
import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import Tile = Phaser.Tilemaps.Tile;
import Sprite = Phaser.Physics.Arcade.Sprite;

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
        sprite.setName(obj.id);
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
        console.log(`Registering ${type} for objs: `, obj, obj2);
        if (type === CollisionType.COLLIDE) {
            return this.scene.physics.add.collider(
                obj.sprite,
                obj2.sprite,
                onCollide,
                null,
                this.scene
            );
        } else if (type === CollisionType.OVERLAP) {
            return this.scene.physics.add.overlap(
                obj.sprite,
                obj2.sprite,
                onCollide,
                null,
                this.scene
            );
        } else {
            throw new Error(`Can't set up collider for type ${type}`);
        }
    };

    addCollisionWithGround = (obj: BaseGameObject, callback) => {
        // TODO: This should add a small distance between the 'wall' and the sprite to make sure there is no bouncing effect.
        this.scene.physics.add.collider(obj.sprite, this.groundLayer, callback);
    };

    collidesTileInDirection = (pos: Vector2, dir: Vector2) => {
        return this.getTilesInDirection(pos, dir).ifPresent(
            ({ properties }) => !!properties.collides
        );
    };

    private getFirstSegmentToGoal = (pos: Vector2, goal: Vector2): TileVector => {
        const direction = goal.clone().subtract(pos);
        return this.getTileVectorForPos(getFirstSegmentOfVector(pos, direction)).value;
    };

    private getSegmentsToGoal = (pos: Vector2, goal: Vector2): TileVector[] => {
        const direction = goal.clone().subtract(pos);
        return segmentVector(pos, direction)
            .map(this.getTileVectorForPos)
            .filter(val => !val.isEmpty())
            .map(val => val.value);
    };

    getTilesToGoal = (start: Sprite | TileVector, goal: Vector2 | Sprite) => {
        const tiles = [
            ...this.getSegmentsToGoal(
                start instanceof Sprite ? start.getTopLeft() : start.center,
                goal instanceof Vector2 ? goal : goal.getTopLeft()
            ),
            ...this.getSegmentsToGoal(
                start instanceof Sprite ? start.getTopRight() : start.topRight,
                goal instanceof Vector2 ? goal : goal.getTopRight()
            ),
            ...this.getSegmentsToGoal(
                start instanceof Sprite ? start.getBottomLeft() : start.bottomLeft,
                goal instanceof Vector2 ? goal : goal.getBottomRight()
            ),
            ...this.getSegmentsToGoal(
                start instanceof Sprite ? start.getBottomRight() : start.bottomRight,
                goal instanceof Vector2 ? goal : goal.getBottomRight()
            ),
        ];
        return [...TileVectorSet.from(tiles)];
    };

    getNextTilesToGoal = (sprite: Sprite, goal: Vector2 | Sprite) => {
        const tiles = [
            this.getFirstSegmentToGoal(
                sprite.getTopLeft(),
                goal instanceof Vector2 ? goal : goal.getTopLeft()
            ),
            this.getFirstSegmentToGoal(
                sprite.getTopRight(),
                goal instanceof Vector2 ? goal : goal.getTopRight()
            ),
            this.getFirstSegmentToGoal(
                sprite.getBottomLeft(),
                goal instanceof Vector2 ? goal : goal.getBottomRight()
            ),
            this.getFirstSegmentToGoal(
                sprite.getBottomRight(),
                goal instanceof Vector2 ? goal : goal.getBottomRight()
            ),
        ];
        return [...TileVectorSet.from(tiles)];
    };

    getTilesInDirection = (pos: Vector2, dir: Vector2) => {
        const posInDir = pos.clone().add(dir.clone().scale(TILE_SIZE));
        const tilePos = this.getTileForPos(posInDir);
        return tilePos;
    };

    getAdjacentTileVectorsFromPos = (pos: Vector2, includeDiagonal = false) => {
        const tileOpt = this.getTileForPos(pos);
        if (tileOpt.isEmpty()) {
            throw new Error(`No tile at position: ${pos}`);
        }
        const { x, y } = tileOpt.value;
        // TODO: This should be transferable to a function call (cross product?).
        const straightTilePositions = [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y],
        ];
        const diagonalTilePositions = [
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x + 1, y + 1],
            [x - 1, y - 1],
        ];
        const adjacentTilePositions = [
            ...straightTilePositions,
            ...(includeDiagonal ? diagonalTilePositions : []),
        ]
            .filter(([posX, posY]) => posX > 0 && posY > 0)
            .map(([posX, posY]) => new Vector2(posX, posY));
        return adjacentTilePositions
            .map(this.getTileVectorForTilePos)
            .filter(tile => !tile.isEmpty())
            .map(tile => tile.value);
    };

    // TODO: Remove.
    getAdjacentTilesFromPos = (pos: Vector2, includeDiagonal = false) => {
        const tileOpt = this.getTileForPos(pos);
        if (tileOpt.isEmpty()) {
            throw new Error(`No tile at position: ${pos}`);
        }
        const { x, y } = tileOpt.value;
        // TODO: This should be transferable to a function call (cross product?).
        const straightTilePositions = [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y],
        ];
        const diagonalTilePositions = [
            [x - 1, y + 1],
            [x + 1, y - 1],
            [x + 1, y + 1],
            [x - 1, y - 1],
        ];
        const adjacentTilePositions = [
            ...straightTilePositions,
            ...(includeDiagonal ? diagonalTilePositions : []),
        ]
            .filter(([posX, posY]) => posX > 0 && posY > 0)
            .map(([posX, posY]) => new Vector2(posX, posY));
        return adjacentTilePositions
            .map(this.getTileForTilePos)
            .filter(tile => !tile.isEmpty())
            .map(tile => tile.value);
    };

    getTileVectorForTilePos = (tilePos: Vector2) => {
        const tile = this.groundLayer.getTileAt(tilePos.x, tilePos.y);
        return Optional.of(new TileVector(tile));
    };

    // TODO: Remove.
    getTileForTilePos = (tilePos: Vector2) => {
        const tile = this.groundLayer.getTileAt(tilePos.x, tilePos.y);
        return Optional.of(tile);
    };

    getTileVectorForPos = (pos: Vector2) => {
        const tile = this.groundLayer.getTileAtWorldXY(pos.x, pos.y);
        return Optional.of(new TileVector(tile));
    };

    // TODO: Remove.
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

    areOnSameTile = (objA: Vector2, objB: Vector2) => {
        return this.getTilePosForPos(objA).equals(this.getTilePosForPos(objB));
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
