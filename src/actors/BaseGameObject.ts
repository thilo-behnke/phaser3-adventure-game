import { Direction } from '../global/direction';
import Sprite = Phaser.Physics.Arcade.Sprite;
import Point = Phaser.Geom.Point;

export abstract class BaseGameObject {
    protected sprite?: Phaser.Physics.Arcade.Sprite; // Sprite might not available when not on screen.

    protected acceleration: Point;

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
}
