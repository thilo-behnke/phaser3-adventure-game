import { BaseGameObject } from '../BaseGameObject';

export interface State<T> {
    enter: (obj: BaseGameObject) => void;
    update: (time: number, obj: BaseGameObject, directive: T) => State<T>;
    exit: (obj: BaseGameObject) => void;
}
