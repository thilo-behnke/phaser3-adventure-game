import {singleton} from "tsyringe";
import {BaseGameObject} from "../actors/baseGameObject";
import SceneManager = Phaser.Scenes.SceneManager;
import {SceneProvider} from "../scene/SceneProvider";
import {COLLISION_GROUP_PROP} from "./CollisionGroupDef";

@singleton()
export class CollisionDetectionManager {

    constructor(private sceneProvider: SceneProvider){}

    register = (obj: BaseGameObject) => {
        const collisionGroup = COLLISION_GROUP_PROP in obj ? obj['collisionGroup'] : null;
        if(!collisionGroup) {
            throw new Error("Can't register collision for obj " + obj.id + " without a collision group!");
        }
        this.sceneProvider.addCollider(obj, collisionGroup);
    }

}
