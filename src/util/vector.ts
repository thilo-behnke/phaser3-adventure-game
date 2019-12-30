import { BaseGameObject } from '../actors/BaseGameObject';
import { Optional } from './fp';
import { range } from 'lodash';
import { Vector } from 'phaser/types/matter';
import Vector2 = Phaser.Math.Vector2;
import { TILE_SIZE } from '../shared/constants';
import { DynamicGameObject } from '../actors/DynamicGameObject';

export const getClosestObj = (
    obj: DynamicGameObject,
    other: DynamicGameObject[],
    alive = true
): Optional<DynamicGameObject> => {
    if (!other.length) {
        return Optional.empty();
    }
    const objPos = obj.sprite.getCenter();
    const sorted = [...other].sort((a, b) => {
        const lengthA = a.sprite
            .getCenter()
            .subtract(objPos)
            .length();
        const lengthB = b.sprite
            .getCenter()
            .subtract(objPos)
            .length();
        return lengthA - lengthB;
    });
    const closest = sorted.find(({ dying }) => !alive || !dying);
    return Optional.of(closest);
};

export const getFirstSegmentOfVector = (start: Vector2, vector: Vector2) => {
    const normalizedVector = vector.clone().normalize();
    return start.clone().add(normalizedVector.clone().scale(TILE_SIZE));
};

export const segmentVector = (start: Vector2, vector: Vector2) => {
    const vectorLength = vector.clone().length();
    const segments = Math.ceil(vectorLength / TILE_SIZE);
    const normalizedVector = vector.clone().normalize();
    return range(segments).map(i => {
        const scale = i === segments - 1 ? vectorLength / TILE_SIZE : (i + 1) * TILE_SIZE;
        return start.clone().add(normalizedVector.clone().scale(scale));
    });
};
