import { BaseGameObject } from '../actors/BaseGameObject';

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
