import {MonsterState} from "./MonsterState";
import {DynamicGameObject} from "../../DynamicGameObject";
import {State} from "../State";
import {BaseGameObject} from "../../BaseGameObject";
import {MonsterObject} from "../../MonsterObject";

export class FollowingState implements MonsterState {
    constructor(private following: DynamicGameObject) {}

    enter = (obj: MonsterObject): void => {
        obj.playWalkingAnim();
    };
    update = (monster: MonsterObject, objs: DynamicGameObject[]): MonsterState => {
        // TODO: Should evaluate if it is still worth it to follow.
        monster.accelerateTowards(this.following.getSprite().getCenter());
        return this;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject): void => {
        return;
    };
}
