import { Direction } from '../global/direction';
import Sprite = Phaser.Physics.Arcade.Sprite;

export abstract class BaseGameObject {
    protected sprite?: Phaser.Physics.Arcade.Sprite; // Sprite might not available when not on screen.

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

    private setPos = (pos: Phaser.Geom.Point): void => {
        this.sprite.setPosition(pos.x, pos.y);
    };

    private setPosX = (x: number): void => {
        this.sprite.setPosition(x, this.sprite.y);
    };

    private setPosY = (y: number): void => {
        this.sprite.setPosition(this.sprite.x, y);
    };

    public accelerate = (directions: [Direction | null, Direction | null]): void => {
        const [dirX, dirY] = directions;
        const accX =
            dirX === Direction.LEFT ? -100 : dirX === Direction.RIGHT ? 100 : 0;
        const accY =
            dirY === Direction.UP ? -100 : dirY === Direction.DOWN ? 100 : 0;
        this.getSprite().setAcceleration(accX, accY);
    };
}
