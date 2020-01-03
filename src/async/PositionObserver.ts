import Vector2 = Phaser.Math.Vector2;
import { Observer } from './Observer';
import { SceneProvider } from '../scene/SceneProvider';
import Sprite = Phaser.Physics.Arcade.Sprite;
import { generateUUID } from '../util/random';
import { injectable } from 'tsyringe';

export class PositionObserver implements Observer<Vector2> {
    private receiveFunc: (data: Vector2) => void;
    private interval: NodeJS.Timeout;

    constructor(private sprite: Sprite) {
        this.interval = setInterval(() => this.receive(sprite.getCenter()), 100);
    }
    onReceive = (func: (data: Vector2) => void) => {
        this.receiveFunc = func;
        return this;
    };
    getId = () => {
        return 'PositionObserver--' + generateUUID();
    };
    receive = (data: Vector2) => {
        this.receiveFunc(data);
    };
    shutdown = () => {
        clearInterval(this.interval);
    };
}
