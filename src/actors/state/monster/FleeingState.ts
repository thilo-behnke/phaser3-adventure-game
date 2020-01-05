import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import { State } from '../State';
import { SceneProvider } from '../../../scene/SceneProvider';
import { BaseGameObject } from '../../BaseGameObject';
import { container } from 'tsyringe';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import { IdleState } from './IdleState';
import { getClosestObj } from '../../../util/vector';
import Vector2 = Phaser.Math.Vector2;
import { validatePosInMap } from '../../../util/map';
import { AttackingState } from './AttackingState';
import { EventRegistry } from '../../../event/EventRegistry';

export class FleeingState implements MonsterState {
    private sceneProvider: SceneProvider;
    private eventRegistry: EventRegistry;

    constructor(public fleeingFrom: BaseGameObject | null) {
        this.sceneProvider = container.resolve(SceneProvider);
        this.eventRegistry = container.resolve(EventRegistry);
    }

    enter = (monster: MonsterObject) => {
        monster.attentionRadius = monster.baseStats.attentionRadius * 2;
        monster.activeAnim = DynamicObjectAnimation.WALKING;
    };
    exit = (monster: MonsterObject) => {
        monster.attentionRadius = monster.baseStats.attentionRadius;
    };
    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]) => {
        // Run from the closest obj.
        const closestObj = getClosestObj(monster, objs);
        if (closestObj.isEmpty()) {
            return new IdleState();
        }
        if (this.eventRegistry.wasAttackedLastLoop(monster)) {
            return new AttackingState(closestObj.value);
        }
        this.fleeingFrom = closestObj.value;
        const fleeingDirection = monster.sprite
            .getCenter()
            .clone()
            .subtract(closestObj.value.sprite.getCenter());
        const goal = monster.sprite
            .getCenter()
            .clone()
            .add(fleeingDirection.scale(3));
        const tilesToFleeingSpot = this.sceneProvider.getTilesToGoal(monster.sprite, goal);
        if (!tilesToFleeingSpot.length) {
            // Don't move if nowhere to go.
            return;
        }
        // TODO: Does not always give the farthest tile.
        const farthestTile = tilesToFleeingSpot[tilesToFleeingSpot.length - 1];
        monster.moveTo(farthestTile.center, this.fleeingFrom.sprite.getCenter());
        return this;
    };
}
