import { MonsterState } from './MonsterState';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterObject } from '../../MonsterObject';
import { getClosestObj } from '../../../util/vector';
import { FollowingState } from './FollowingState';
import { getNumberBetween } from '../../../util/random';
import { IdleState } from './IdleState';
import { Subject } from 'rxjs';
import { DebugService } from '../../../util/DebugService';
import { container } from 'tsyringe';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../shared/constants';
import { DynamicObjectAnimation } from '../../anim/DynamicObjectAnimation';
import Vector2 = Phaser.Math.Vector2;
import { SceneProvider } from '../../../scene/SceneProvider';

export class ObservingState implements MonsterState {
    private OBSERVING_TIME_MS = 1500;
    public movingTo: Vector2 | undefined;
    private startedObserving = null;
    // How long to observe.
    private counter = 5;

    private debugSub: Subject<void>;
    private debugService: DebugService;
    private sceneProvider: SceneProvider;

    constructor() {
        this.debugService = container.resolve(DebugService);
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
            const preferredObj = getClosestObj(monster, objs);
            if (preferredObj.isEmpty()) {
                return this;
            }
            return new FollowingState(preferredObj.value);
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
        const radius = getNumberBetween(450, 90);
        const distance = getNumberBetween(100, 200);
        // TODO: Don't allow point in colliding tile.
        const movingTo = monster.sprite
            .getCenter()
            .clone()
            .add(new Vector2(Math.cos(radius), Math.sin(radius)).scale(distance));
        // Don't allow point outside of screen.
        const movingToInsideScreen = new Vector2(
            Math.max(0, Math.min(movingTo.x, SCREEN_WIDTH)),
            Math.max(0, Math.min(movingTo.y, SCREEN_HEIGHT))
        );
        // TODO: This could create an endless loop.
        if (this.sceneProvider.isCollidingTileForPos(movingTo)) {
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
