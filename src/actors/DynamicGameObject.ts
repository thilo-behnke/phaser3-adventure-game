import { BaseGameObject } from './BaseGameObject';
import { IPlayerStateMachine } from './state/player/IPlayerStateMachine';
import { Direction } from '../global/direction';

export abstract class DynamicGameObject extends BaseGameObject {
    abstract playIdleAnim: () => void;
    abstract playWalkingAnim: () => void;
}
