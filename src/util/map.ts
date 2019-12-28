import Vector2 = Phaser.Math.Vector2;
import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from '../shared/constants';
import { isBetween } from './general';

export const validatePosInMap = (pos: Vector2) => {
    // Don't allow point outside of screen.
    return new Vector2(
        Math.max(0, Math.min(pos.x, SCREEN_WIDTH - 1)),
        Math.max(0, Math.min(pos.y, SCREEN_HEIGHT - 1))
    );
};

export const isDiagonalMove = (start: Vector2, end: Vector2) => {
    const direction = end.clone().subtract(start);
    return (Math.atan(direction.y / direction.x) * 180) / Math.PI === 45;
};

export const isValidTile = (tileX: number, tileY: number) => {
    return (
        isBetween(tileX, 0, SCREEN_WIDTH / TILE_SIZE - 1) &&
        isBetween(tileY, 0, SCREEN_HEIGHT / TILE_SIZE - 1)
    );
};
