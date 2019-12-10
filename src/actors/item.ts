import { BaseGameObject } from './baseGameObject';

export abstract class ItemObject extends BaseGameObject {
    abstract onPickup: () => void;
    abstract onUse: () => void;
}
