import { BaseGameObject } from '../BaseGameObject';

export interface State<T> {
    enter: (obj: BaseGameObject) => void;
    update: (obj: BaseGameObject, directive: T) => State<T>;
    exit: (obj: BaseGameObject) => void;
}
