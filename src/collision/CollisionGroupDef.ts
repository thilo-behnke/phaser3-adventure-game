import { CollisionGroup } from './CollisionGroup';

export const COLLISION_GROUP_PROP = 'collisionGroup';

export function CollisionGroupDef(group: CollisionGroup) {
    return function Factory<T extends { new (...args: any[]): {} }>(
        constructor: T
    ) {
        return class extends constructor {
            [COLLISION_GROUP_PROP] = group;
        };
    };
}
