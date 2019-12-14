import Point = Phaser.Geom.Point;

export interface IGameObjectFactory {
    addToScene: (pos: Point, seed: number) => void;
}
