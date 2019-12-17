import { Direction } from '../global/direction';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Point = Phaser.Geom.Point;

export abstract class BaseGameObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _type: any;
    protected sprite?: Phaser.Physics.Arcade.Sprite; // Sprite might not available when not on screen.

    protected acceleration: Point;

    // Lifecycle hooks.
    abstract onAddToScene: () => void;
    abstract update: (delta: number) => void;

    constructor(private _id: string) {}

    get id(): string {
        return this._id;
    }

    public setSprite = (sprite: Phaser.Physics.Arcade.Sprite): void => {
        this.sprite = sprite;
    };

    public getSprite = (): Sprite => this.sprite;

    // TODO: Is there a more performant way?
    public destroySprite = (): void => {
        this.sprite.destroy(true);
        this.sprite = undefined;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get type(): any {
        return this._type;
    }
}
