import { BaseGameObject } from '../actors/BaseGameObject';
import { Optional } from './fp';

export const getClosesTObj = (
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
