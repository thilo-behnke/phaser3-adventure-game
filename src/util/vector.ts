import { BaseGameObject } from '../actors/BaseGameObject';
import { Optional } from './fp';
import { range } from 'lodash';
import { Vector } from 'phaser/types/matter';
import Vector2 = Phaser.Math.Vector2;
import { TILE_SIZE } from '../shared/constants';

export const getClosestObj = (
    obj: BaseGameObject,
    other: BaseGameObject[]
): Optional<BaseGameObject> => {
    if (!other.length) {
        return Optional.empty();
    }
    const objPos = obj.sprite.getCenter();
    const closest = other.reduce((acc, x) =>
        x.sprite
            .getCenter()
            .subtract(objPos)
            .length() <
        acc.sprite
            .getCenter()
            .subtract(objPos)
            .length()
            ? x
            : acc
    );
    return Optional.of(closest);
};

export const segmentVector = (start: Vector2, vector: Vector2) => {
    const vectorLength = vector.clone().length();
    const segments = Math.ceil(vectorLength / TILE_SIZE);
    const normalizedVector = vector.clone().normalize();
    return range(segments).map(i => {
        return start.clone().add(normalizedVector.clone().scale((i + 1) * TILE_SIZE));
    });
};
