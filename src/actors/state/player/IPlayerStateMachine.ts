import { DynamicGameObject } from '../../DynamicGameObject';
import { ActiveActions } from '../../../input/keyManager';
import { State } from '../State';
import { PlayerState } from './PlayerState';
import { Player } from '../../Player';

export interface IPlayerStateMachine {
    currentState: PlayerState;

    update: (delta: number, player: Player, actions: ActiveActions) => void;
}
