import { BaseGameObject } from '../BaseGameObject';

export interface State {
    enter: (obj: BaseGameObject) => void;
    update: (obj: BaseGameObject, actions) => State;
    exit: (obj: BaseGameObject) => void;
}
