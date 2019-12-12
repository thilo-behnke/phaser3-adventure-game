import Point = Phaser.Geom.Point;

export interface IGameObjectFactory {
    generate: () => number;
    addToScene: (id: number, pos: Point) => void;
}
