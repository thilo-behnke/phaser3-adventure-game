import { CollisionGroup, CollisionType } from './CollisionGroup';

export const COLLISION_GROUP_PROP = 'collisionGroup';
export const COLLISION_TYPE_PROP = 'collisionType';

export function CollisionGroupDef(group: CollisionGroup, type: CollisionType) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-explicit-any
    return function Factory<T extends { new (...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            [COLLISION_GROUP_PROP] = group;
            [COLLISION_TYPE_PROP] = type;
        };
    };
}
