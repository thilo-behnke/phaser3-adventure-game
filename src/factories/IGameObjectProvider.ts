import {BaseGameObject} from "../actors/baseGameObject";
import {Observable} from "rxjs";

export interface IGameObjectProvider {
    getGameObjects: () => Observable<BaseGameObject[]>
}
