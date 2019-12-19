import { Direction } from '../global/direction';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Point = Phaser.Geom.Point;

export abstract class BaseGameObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _type: any;
    protected _sprite?: Phaser.Physics.Arcade.Sprite; // Sprite might not available when not on screen.

    protected acceleration: Point;

    // Lifecycle hooks.
    abstract onAddToScene: () => void;
    abstract update: (delta: number) => void;

    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }

    public setSprite = (sprite: Phaser.Physics.Arcade.Sprite): void => {
        this._sprite = sprite;
    };

    get sprite(): Sprite {
        return this._sprite;
    }

    // TODO: Is there a more performant way?
    public destroySprite = (): void => {
        this._sprite.destroy(true);
        this._sprite = undefined;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get type(): any {
        return this._type;
    }
}
