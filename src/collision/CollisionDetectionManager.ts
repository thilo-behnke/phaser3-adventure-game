import {injectable, singleton} from "tsyringe";
import {BaseGameObject} from "../actors/baseGameObject";
import SceneManager = Phaser.Scenes.SceneManager;
import {SceneProvider} from "../scene/SceneProvider";
import {COLLISION_GROUP_PROP} from "./CollisionGroupDef";

@singleton()
@injectable()
export class CollisionDetectionManager {

    constructor(private sceneProvider: SceneProvider){}

    register = (gameObject: BaseGameObject) => {
        const collisionGroup = COLLISION_GROUP_PROP in gameObject ? gameObject['collisionGroup'] : null;
        if(!collisionGroup) {
            throw new Error("Can't register collision for obj " + gameObject.id + " without a collision group!");
        }
        // TODO: Get the correct object from some store somewhere depending on the group (e.g. player)
        // TODO: Get the correct callback function for the collision (maybe from another service given the two objects? If so, this needs to be moved one level up.
        this.sceneProvider.addCollider(gameObject, collisionGroup, () => {});
    }

}
