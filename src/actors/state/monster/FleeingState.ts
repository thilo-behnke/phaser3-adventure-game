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
        const fromMonster = monster.sprite
            .getCenter()
            .clone()
            .subtract(closestObj.value.sprite.getCenter());
        let fleeingFromPos = monster.sprite
            .getCenter()
            .clone()
            .add(fromMonster);
        const fleeingFromPosTileInsideScreen = validatePosInMap(fleeingFromPos);
        let fleeingFromPosTile = this.sceneProvider.getTileVectorForPos(
            fleeingFromPosTileInsideScreen
        );
        // When running into a colliding tile, try to find a free way.
        while (fleeingFromPosTile.value.collides()) {
            fleeingFromPos = monster.sprite
                .getCenter()
                .clone()
                .add(
                    fleeingFromPos
                        .normalize()
                        .clone()
                        .add(new Vector2(1, -1))
                        .scale(fromMonster.length())
                );
            fleeingFromPosTile = this.sceneProvider.getTileVectorForPos(fleeingFromPos);
        }
        monster.moveTo(fleeingFromPos);
        return this;
    };
}
