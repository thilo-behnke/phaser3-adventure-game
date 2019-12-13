import {GameObjectFactory} from "./GameObjectFactory";
import {CollectableMonsterObject, Monster} from "../actors/collectableMonsterObject";
import {NUMBER_OF_MONSTERS} from "../shared/constants";
import {autoInjectable, injectable, singleton} from "tsyringe";
import {SceneProvider} from "../scene/SceneProvider";

/*@singleton()*/
@injectable()
export class MonsterFactory extends GameObjectFactory<CollectableMonsterObject> {

    constructor(sceneProvider: SceneProvider) {
        super(sceneProvider);
    }

    protected generateObject (): [number, CollectableMonsterObject] {
        // Determine the monster.
        // TODO: Implement: The seed most come in as an input (e.g. from a capsule)
        const seed = Date.now();
        const mod = seed % NUMBER_OF_MONSTERS;
        const stats = {
            type: Monster.WOLF,
            health: 100,
            strength: 100,
            agility: 100,
        };
        return [seed, CollectableMonsterObject.generate(seed, stats)];
    }

}
