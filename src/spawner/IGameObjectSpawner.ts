import {ExplorationMap} from "../map/ExplorationMap";

export interface IGameObjectSpawner {
    spawn: (map: ExplorationMap) => void
}

