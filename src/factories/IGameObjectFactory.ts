import { BaseGameObject } from '../actors/BaseGameObject';

export interface IGameObjectFactory<T extends BaseGameObject> {
    generateObject: (seed: number) => T;
}
