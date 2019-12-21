import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { Subject } from 'rxjs';
import { range } from 'lodash';
import { BaseGameObject } from '../actors/BaseGameObject';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { Color, SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';
import { cartesianProduct } from './general';
import Vector2 = Phaser.Math.Vector2;
import Shape = Phaser.GameObjects.Shape;

@injectable()
export class DebugService {
    private updatingElements = [];

    private playerPosText;
    private objPosText = {};

    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry
    ) {}

    update() {
        this.updatingElements.forEach(func => func());
    }

    showGrid(showTileCoordinates = false) {
        const gridLen = 50,
            gridColor = Color.GREY,
            gridAlpha = 0.2;
        range(1, SCREEN_WIDTH / gridLen).forEach(pos => {
            const grid = pos * gridLen;
            // Vertical lines.
            this.sceneProvider.addLine(
                new Vector2(grid, 0),
                new Vector2(grid, SCREEN_HEIGHT),
                gridColor,
                gridAlpha
            );
        });
        range(1, SCREEN_HEIGHT / gridLen).forEach(pos => {
            const grid = pos * gridLen;
            // Horizontal lines.
            this.sceneProvider.addLine(
                new Vector2(0, grid),
                new Vector2(SCREEN_WIDTH, grid),
                gridColor,
                gridAlpha
            );
        });
        if (showTileCoordinates) {
            const gridTiles = cartesianProduct(
                range(SCREEN_HEIGHT / gridLen),
                range(SCREEN_WIDTH / gridLen)
            );
            gridTiles.forEach(tilePos => {
                const [x, y] = tilePos;
                this.sceneProvider.addText(x * gridLen, y * gridLen, `${x}/${y}`, Color.GREY);
            });
        }
    }

    showPlayerPos() {
        this.updatingElements.push(() => {
            const playerPos = this.gameObjectRegistry.getPlayer().sprite.getCenter();
            const newText = `Player - x: ${playerPos.x.toFixed(2)}, y: ${playerPos.y.toFixed(2)}`;
            if (!this.playerPosText) {
                this.playerPosText = this.sceneProvider.addText(
                    SCREEN_WIDTH - 300,
                    100,
                    newText,
                    Color.WHITE,
                    16
                );
                return;
            }
            this.playerPosText.setText(newText);
            this.playerPosText.updateText();
        });
    }

    showObjectPos(id: string) {
        this.updatingElements.push(() => {
            const obj = this.gameObjectRegistry.getById(id);
            if (obj.isEmpty()) {
                return;
            }
            const newText = `Obj - x: ${obj.value.sprite.x.toFixed(
                2
            )}, y: ${obj.value.sprite.y.toFixed(2)}`;
            if (!this.objPosText[id]) {
                this.objPosText[id] = this.sceneProvider.addText(
                    SCREEN_WIDTH - 300,
                    this.updatingElements.length * 20 + 100,
                    newText,
                    Color.WHITE,
                    16
                );
                return;
            }
            this.objPosText[id].setText(newText);
            this.objPosText[id].updateText();
        });
    }

    drawShapeFromObject(id: string, callback: (obj: BaseGameObject) => Subject<void>) {
        let destructor;
        this.updatingElements.push(() => {
            if (destructor) {
                destructor.next();
            }
            const obj = this.gameObjectRegistry.getById(id);
            if (obj.isEmpty()) {
                return;
            }
            destructor = callback(obj.value);
        });
    }

    drawPoint(pos: Vector2): Subject<void> {
        // TODO: Better add line with right angle (=cross).
        const circle = this.sceneProvider.addCircle(pos.x, pos.y, 2);
        return this.createDestructor(circle);
    }

    drawCircle(center: Vector2, radius: number, color = Color.BLACK, alpha = 1) {
        const circle = this.sceneProvider.addCircle(center.x, center.y, radius, color, alpha);
        return this.createDestructor(circle);
    }

    drawVector(from: Vector2, to: Vector2) {
        const vector = this.sceneProvider.addVector(from, to);
        const point = this.sceneProvider.addCircle(to.x, to.y, Color.BLACK);
        return this.createDestructor(vector, point);
    }

    private createDestructor = (...shapes: Shape[]) => {
        const destructor = new Subject<void>();
        destructor.subscribe(() => shapes.forEach(s => s.destroy(true)));
        return destructor;
    };
}
