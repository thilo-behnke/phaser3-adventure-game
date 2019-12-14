import GameObject = Phaser.GameObjects.GameObject;
import { Direction } from '../global/direction';
import Point = Phaser.Geom.Point;
import Sprite = Phaser.GameObjects.Sprite;

export abstract class BaseGameObject {
    protected sprite?: Phaser.GameObjects.Sprite; // Sprite might not available when not on screen.

    abstract update: (delta: number) => void;

    constructor(private _id: string){}

    get id(): string {
        return this._id;
    }

    public setSprite = (sprite: Sprite) => {
        this.sprite = sprite;
    };

    public getSprite = () => this.sprite;

    // TODO: Is there a more performant way?
    public destroySprite = () => {
        this.sprite.destroy(true);
        this.sprite = undefined;
    };

    private setPos = (pos: Phaser.Geom.Point) => {
        this.sprite.setPosition(pos.x, pos.y);
    };

    private setPosX = (x: number) => {
        this.sprite.setPosition(x, this.sprite.y);
    };

    private setPosY = (y: number) => {
        this.sprite.setPosition(this.sprite.x, y);
    };

    public move = (direction: Direction) => {
        switch (direction) {
            case Direction.DOWN:
                this.setPosY(this.sprite.y + 1);
                break;
            case Direction.UP:
                this.setPosY(this.sprite.y - 1);
                break;
            case Direction.LEFT:
                this.setPosX(this.sprite.x - 1);
                break;
            case Direction.RIGHT:
                this.setPosX(this.sprite.x + 1);
                break;
        }
    };
}
