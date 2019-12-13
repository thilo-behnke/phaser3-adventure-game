import {IGameObjectFactory} from './IGameObjectFactory';
import {IGameObjectProvider} from './IGameObjectProvider';
import {BehaviorSubject, Observable} from 'rxjs';
import {BaseGameObject} from '../actors/baseGameObject';
import {filter} from "rxjs/operators";
import Point = Phaser.Geom.Point;
import {SceneProvider} from "../scene/SceneProvider";
import {injectable} from "tsyringe";

export abstract class GameObjectFactory<T extends BaseGameObject>
    implements IGameObjectFactory {
    private registry: { [key: number]: T } = {};



    protected constructor(protected sceneProvider: SceneProvider) {
    }

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
        this.sceneProvider.addToScene(
            gameObject,
            pos
        );
    }
}
