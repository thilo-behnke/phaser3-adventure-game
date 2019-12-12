import {
    CollectableMonsterObject,
    Monster,
} from '../actors/collectableMonsterObject';
import { NUMBER_OF_MONSTERS } from '../constants';
import Point = Phaser.Geom.Point;
import Scene = Phaser.Scene;
import { IGameObjectFactory } from './IGameObjectFactory';
import { IGameObjectProvider } from './IGameObjectProvider';
import {BehaviorSubject, Observable} from 'rxjs';
import { BaseGameObject } from '../actors/baseGameObject';
import {filter} from "rxjs/operators";
import game from "../game";

export abstract class GameObjectFactory<T extends BaseGameObject>
    implements IGameObjectFactory, IGameObjectProvider {
    private registry: { [key: number]: T } = {};
    private changeSubject = new BehaviorSubject<BaseGameObject[] | undefined>(
        undefined
    );

    protected constructor(protected scene: Phaser.Scene) {}

    protected abstract generateObject(): [number, T];

    generate = (addToScene?: Point) => {
        const [id, obj] = this.generateObject();
        this.registry[id] = obj;
        if(addToScene) {
            this.addToScene(id, addToScene);
        }
        return id;
    };

    addToScene(id: number, pos: Point) {
        const gameObject = this.registry[id];
        if (!gameObject) {
            throw new Error(`GameObject with id ${id} not found!`);
        }
        const sprite = this.scene.add.sprite(
            pos.x,
            pos.y,
            gameObject.id.toString()
        );
        gameObject.setSprite(sprite);
        this.changeSubject.next(Object.values(this.registry));
    }

    getGameObjects = () => {
        return this.changeSubject.asObservable().pipe(filter(val => val !== undefined)) as Observable<BaseGameObject[]>;
    }
}
