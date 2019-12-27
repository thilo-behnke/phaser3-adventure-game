import { BaseGameObject } from '../actors/BaseGameObject';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Tile = Phaser.Tilemaps.Tile;

export const isCloseTo = (objA: BaseGameObject, objB: BaseGameObject) => {
    const centerA = objA.sprite.getCenter();
    const centerB = objB.sprite.getCenter();
    return (
        centerA
            .clone()
            .subtract(centerB)
            .length() < 40
    );
};

export const tileCollider = (objA: BaseGameObject, tile: Tile) => {
    // TODO: Also assign a property to the game object -> colliding.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { pixelX: tileLeft, pixelY: tileTop } = tile;
    const tileRight = tileLeft + tile.baseWidth;
    const tileBottom = tileTop + tile.baseHeight;
    const { x: spriteLeft, y: spriteTop } = objA.sprite.getTopLeft();
    const { x: spriteRight, y: spriteBottom } = objA.sprite.getBottomRight();
    // Collision right.
    if (
        spriteRight <= tileLeft &&
        ((spriteBottom <= tileBottom && spriteBottom >= tileTop) ||
            (spriteTop <= tileBottom && spriteTop >= tileTop))
    ) {
        objA.sprite.setVelocityX(0);
        console.log('Colliding right!');
    } else if (
        // Collision left
        spriteLeft >= tileRight &&
        ((spriteBottom <= tileBottom && spriteBottom >= tileTop) ||
            (spriteTop <= tileBottom && spriteTop >= tileTop))
    ) {
        objA.sprite.setVelocityX(0);
        console.log('Colliding left!');
    } else if (
        // Collision bottom.
        spriteBottom <= tileTop &&
        ((spriteLeft <= tileRight && spriteLeft >= tileLeft) ||
            (spriteRight <= tileRight && spriteRight >= tileRight))
    ) {
        objA.sprite.setVelocityY(0);
        console.log('Colliding bottom!');
    } else if (
        // Collision top.
        spriteTop >= tileTop &&
        ((spriteLeft <= tileRight && spriteLeft >= tileLeft) ||
            (spriteRight <= tileRight && spriteRight >= tileRight))
    ) {
        objA.sprite.setVelocityY(0);
        console.log('Colliding top!');
    }
};
