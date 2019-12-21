import { State } from '../State';
import { MonsterState } from './MonsterState';
import { BaseGameObject } from '../../BaseGameObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import { MonsterObject } from '../../MonsterObject';
import { getClosestObj } from '../../../util/vector';
import { FollowingState } from './FollowingState';
import Vector2 = Phaser.Math.Vector2;
import { getNumberBetween } from '../../../util/random';
import { IdleState } from './IdleState';
import { Subject } from 'rxjs';
import { DebugService } from '../../../util/DebugService';
import { container } from 'tsyringe';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../shared/constants';

export class ObservingState implements MonsterState {
    private OBSERVING_TIME_MS = 1500;
    private movingTo: Vector2 | undefined;
    private startedObserving = null;
    // How long to observe.
    private counter = 5;

    private debugSub: Subject<void>;
    private debugService: DebugService;

    constructor() {
        this.debugService = container.resolve(DebugService);
    }

    enter = (monster: MonsterObject) => {
        monster.playWalkingAnim();
    };

    update = (time: number, monster: MonsterObject, objs: DynamicGameObject[]) => {
        if (objs.length) {
            // TODO: Evaluate objects, maybe most dangerous?
            const preferredObj = getClosestObj(monster, objs);
            if (preferredObj.isEmpty()) {
                return this;
            }
            return new FollowingState(preferredObj.value);
        }
        // Walk to a random point in the nearer area.
        if (
            (!this.movingTo && !this.startedObserving) ||
            (!this.movingTo &&
                this.startedObserving &&
                time - this.startedObserving >= this.OBSERVING_TIME_MS)
        ) {
            this.startedObserving = null;
            this.counter--;
            if (this.counter <= 0) {
                return new IdleState();
            }
            const radius = getNumberBetween(450, 90);
            const distance = getNumberBetween(100, 200);
            this.movingTo = monster.sprite
                .getCenter()
                .clone()
                .add(new Vector2(Math.cos(radius), Math.sin(radius)).scale(distance));
            // Don't allow point outside of screen.
            this.movingTo = new Vector2(
                Math.min(this.movingTo.x, SCREEN_WIDTH),
                Math.min(this.movingTo.y, SCREEN_HEIGHT)
            );
            if (this.debugSub) {
                this.debugSub.next();
            }
            this.debugSub = this.debugService.drawVector(monster.sprite.getCenter(), this.movingTo);
            // Wait for a bit before moving to the next point.
        } else if (this.movingTo && this.movingTo.distance(monster.sprite.getCenter()) < 30) {
            this.startedObserving = time;
            this.movingTo = null;
            monster.break();
        }
        // TODO: Must slow down the acceleration to actually reach the point?
        if (this.movingTo) {
            monster.accelerateTowards(this.movingTo);
        }
        return this;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject) => {
        return;
    };
}
