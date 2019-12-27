import { BaseGameObject } from '../actors/BaseGameObject';
import Sprite = Phaser.Physics.Arcade.Sprite;

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

export const tileCollider = (objA, objB) => {
    const sprite = objA as Sprite;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tile = objB as any;
    const { pixelX: tileLeft, pixelY: tileTop } = tile;
    const tileRight = tileLeft + tile.baseWidth;
    const tileBottom = tileTop + tile.baseHeight;
    const { x: spriteLeft, y: spriteTop } = sprite.getTopLeft();
    const { x: spriteRight, y: spriteBottom } = sprite.getBottomRight();
    // Collision left.
    if (
        spriteRight <= tileLeft &&
        ((spriteBottom <= tileBottom && spriteBottom >= tileTop) ||
            (spriteTop <= tileBottom && spriteTop >= tileTop))
    ) {
        sprite.setVelocityX(0);
        console.log('Colliding left!');
    } else if (
        // Collision right
        spriteLeft >= tileRight &&
        ((spriteBottom <= tileBottom && spriteBottom >= tileTop) ||
            (spriteTop <= tileBottom && spriteTop >= tileTop))
    ) {
        sprite.setVelocityX(0);
        console.log('Colliding right!');
    } else if (
        // Collision top.
        spriteBottom <= tileTop &&
        ((spriteLeft <= tileRight && spriteLeft >= tileLeft) ||
            (spriteRight <= tileRight && spriteRight >= tileRight))
    ) {
        sprite.setVelocityY(0);
        console.log('Colliding top!');
    } else if (
        // Collision bottom.
        spriteTop >= tileTop &&
        ((spriteLeft <= tileRight && spriteLeft >= tileLeft) ||
            (spriteRight <= tileRight && spriteRight >= tileRight))
    ) {
        sprite.setVelocityY(0);
        console.log('Colliding bottom!');
    }
};
