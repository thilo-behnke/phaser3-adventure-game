import {IExplorationMap} from "../map/IExplorationMap";

export interface IGameObjectSpawner {
    spawn: (map: IExplorationMap) => void
}

