import GameObject = Phaser.GameObjects.GameObject;
import { Direction } from '../global/direction';
import Point = Phaser.Geom.Point;

export abstract class BaseGameObject extends GameObject {
    protected sprite: Phaser.GameObjects.Sprite;

    abstract update: (delta: number) => void;

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
        console.log(direction);
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
