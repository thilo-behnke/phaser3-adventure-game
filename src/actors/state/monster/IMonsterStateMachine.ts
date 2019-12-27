import { MonsterState } from './MonsterState';
import { MonsterObject } from '../../MonsterObject';
import { DynamicGameObject } from '../../DynamicGameObject';
import Vector2 = Phaser.Math.Vector2;
import { FollowingState } from './FollowingState';
import { ObservingState } from './ObservingState';
import { FollowingPlayerState } from './FollowingPlayerState';
import { PathFinding } from '../../../ai/PathFinding';

export abstract class IMonsterStateMachine {
    currentState: MonsterState;
    protected pathFinding: PathFinding;

    abstract update: (time: number, monster: MonsterObject) => void;

    isMovingTowardsPos = () => {
        if (this.currentState instanceof FollowingState) {
            return this.currentState.following.sprite.getCenter();
        } else if (this.currentState instanceof ObservingState) {
            return this.currentState.movingTo;
        } else if (this.currentState instanceof FollowingPlayerState) {
            return this.currentState.player.sprite.getCenter();
        }
        return null;
    };
}
