import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterNature, MonsterObject } from '../../MonsterObject';
import { getClosestObj } from '../../../util/vector';
import { FollowingState } from './FollowingState';
import { getRandomNumberBetween } from '../../../util/random';
import { IdleState } from './IdleState';
import { Subject } from 'rxjs';
import { UIService } from '../../../util/UIService';
import { container } from 'tsyringe';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import Vector2 = Phaser.Math.Vector2;
import { SceneProvider } from '../../../scene/SceneProvider';
import { FleeingState } from './FleeingState';
import { validatePosInMap } from '../../../util/map';
import { Optional } from '../../../util/fp';

export class WanderingState implements MonsterState {
    private OBSERVING_TIME_MS = 1500;
    public movingTo: Vector2 | undefined;
    private startedObserving = null;

    private debugSub: Subject<void>;
    private debugService: UIService;
    private sceneProvider: SceneProvider;

    constructor(private counter: number = 5) {
        this.debugService = container.resolve(UIService);
        this.sceneProvider = container.resolve(SceneProvider);
    }

    enter = (monster: MonsterObject) => {
        monster.break();
    };

    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]) => {
        if (!this.movingTo && !this.startedObserving) {
            this.startedObserving = time;
            return this;
        }
        if (objs.length) {
            // TODO: Evaluate objects, maybe most dangerous?
            const preferredObj = getClosestObj(monster, objs) as Optional<DynamicGameObject>;
            if (!preferredObj.isEmpty()) {
                if (monster.baseStats.nature === MonsterNature.AGGRESSIVE) {
                    return new FollowingState(preferredObj.value);
                } else if (monster.baseStats.nature === MonsterNature.SHY) {
                    return new FleeingState(preferredObj.value);
                }
            }
        }
        // Walk to a random point in the nearer area.
        // Wait for a bit before moving to the next point.
        if (!this.movingTo && time - this.startedObserving >= this.OBSERVING_TIME_MS) {
            this.startedObserving = null;
            this.counter--;
            if (this.counter <= 0) {
                return new IdleState();
            }
            this.movingTo = this.getRandomPointToMoveTo(monster);
            monster.activeAnim = DynamicObjectAnimation.WALKING;
        } else if (this.movingTo && this.movingTo.distance(monster.sprite.getCenter()) < 30) {
            this.startedObserving = time;
            this.movingTo = null;
            monster.break();
        }
        // TODO: Must slow down the acceleration to actually reach the point?
        if (this.movingTo) {
            monster.moveTo(this.movingTo);
        }
        return this;
    };

    private getRandomPointToMoveTo = (monster: MonsterObject) => {
        const radius = getRandomNumberBetween(450, 90);
        const distance = getRandomNumberBetween(100, 200);
        // TODO: Don't allow point in colliding tile.
        const movingTo = monster.sprite
            .getCenter()
            .clone()
            .add(new Vector2(Math.cos(radius), Math.sin(radius)).scale(distance));
        // Don't allow point outside of screen.
        const movingToInsideScreen = validatePosInMap(
            this.sceneProvider.getMapDimensions(),
            movingTo
        );
        // TODO: This could create an endless loop.
        if (this.sceneProvider.isCollidingTileForPos(movingToInsideScreen)) {
            console.debug('Monster randomly selected point in colliding tile...');
            return this.getRandomPointToMoveTo(monster);
        }
        return movingToInsideScreen;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject) => {
        return;
    };
}
