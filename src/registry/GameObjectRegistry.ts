import { singleton } from 'tsyringe';
import { CollisionGroup } from '../collision/CollisionGroup';
import { COLLISION_GROUP_PROP } from '../collision/CollisionGroupDef';
import { BaseGameObject } from '../actors/BaseGameObject';
import { Player } from '../actors/Player';
import Vector2 = Phaser.Math.Vector2;
import Point = Phaser.Geom.Point;
import { Optional } from '../util/fp';
import { MonsterObject } from '../actors/MonsterObject';
import { BehaviorSubject, Observable } from 'rxjs';

@singleton()
export class GameObjectRegistry {
    private registry: { [key: string]: BaseGameObject } = {};
    private player: Player;

    private subject = new BehaviorSubject(Object.values(this.registry));

    setPlayer(player: Player): void {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }

    getPlayerPos = (): Point => {
        // TODO: Maybe we should just use Vector2 in general?
        const { x, y } = this.player.sprite.getCenter();
        return new Point(x, y);
    };

    add(id: string, obj: BaseGameObject): void {
        this.registry[id] = obj;
        this.subject.next(Object.values(this.registry));
    }

    remove(id: string): void {
        delete this.registry[id];
        this.subject.next(Object.values(this.registry));
    }

    getByCollisionGroup(collisionGroup: CollisionGroup): BaseGameObject[] {
        if (collisionGroup === CollisionGroup.PLAYER) {
            return [this.player];
        }
        return Object.values(this.registry).filter(gameObject => {
            const group = COLLISION_GROUP_PROP in gameObject ? gameObject['collisionGroup'] : null;
            return group && group === collisionGroup;
        });
    }

    // TODO: Remove.
    getObjects = (): BaseGameObject[] => {
        return Object.values(this.registry);
    };

    subscribeObjects = (): Observable<BaseGameObject[]> => {
        return this.subject.asObservable();
    };

    getMonsters = (): MonsterObject[] => {
        return Object.values(this.registry)
            .filter(obj => obj instanceof MonsterObject)
            .map(obj => obj as MonsterObject);
    };

    getById = (id: string): Optional<BaseGameObject> => {
        const obj = this.registry[id];
        return Optional.of(obj);
    };
}
