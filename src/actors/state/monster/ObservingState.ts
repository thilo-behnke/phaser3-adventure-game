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
import { SCREEN_HEIGHT } from '../../../shared/constants';

export class ObservingState implements MonsterState {
    private movingTo: Vector2 | undefined;
    // How long to observe.
    private counter = 3;

    private debugSub: Subject<void>;
    private debugService: DebugService;

    constructor() {
        this.debugService = container.resolve(DebugService);
    }

    enter = (monster: MonsterObject) => {
        monster.playWalkingAnim();
    };

    update = (monster: MonsterObject, objs: DynamicGameObject[]) => {
        if (this.counter <= 0) {
            return new IdleState();
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
        if (!this.movingTo || this.movingTo.subtract(monster.sprite.getCenter()).length() < 10) {
            // TODO: Radius not correctly aligned.
            const radius = getNumberBetween(450, 90);
            const distance = getNumberBetween(20, 120);
            console.log(
                'new point to move to: ',
                { radius },
                { distance },
                monster.sprite
                    .getCenter()
                    .add(new Vector2(Math.cos(radius), Math.sin(radius)).scale(distance))
            );
            if (this.debugSub) {
                this.debugSub.next();
            }
            console.log(SCREEN_HEIGHT - Math.sin(radius));
            this.movingTo = monster.sprite
                .getCenter()
                .add(new Vector2(Math.cos(radius), Math.sin(radius)).scale(distance));
            this.debugSub = this.debugService.drawVector(monster.sprite.getCenter(), this.movingTo);
            this.debugSub = this.debugService.drawPoint(monster.sprite.getCenter());
            console.log(
                console.log(radius),
                new Vector2(Math.cos(radius), Math.sin(radius)).scale(distance)
            );
            this.counter--;
        }
        // TODO: Must slow down the acceleration to actually reach the point?
        monster.accelerateTowards(this.movingTo);
        return this;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    exit = (monster: MonsterObject) => {
        return;
    };
}
