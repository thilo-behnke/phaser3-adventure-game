import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { Subject } from 'rxjs';
import { range, size, differenceWith, fromPairs } from 'lodash';
import { BaseGameObject } from '../actors/BaseGameObject';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { Color, SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';
import { cartesianProduct } from './general';
import Vector2 = Phaser.Math.Vector2;
import Shape = Phaser.GameObjects.Shape;
import { distinctUntilChanged, filter, map, tap } from 'rxjs/internal/operators';
import { MonsterObject } from '../actors/MonsterObject';
import { CircleDebugInfo, DebugInformation, DebugShape } from '../actors/Debuggable';

@injectable()
export class DebugService {
    private updatingElements: { [key: string]: Function } = {};

    private playerPosText;
    private objPosText = {};

    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry
    ) {}

    update() {
        Object.values(this.updatingElements).forEach(func => func());
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
        this.updatingElements['player-pos'] = () => {
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
        };
    }

    showObjectPos(id: string) {
        this.updatingElements[`${id}-pos`] = () => {
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
                    size(this.updatingElements) * 20 + 100,
                    newText,
                    Color.WHITE,
                    16
                );
                return;
            }
            this.objPosText[id].setText(newText);
            this.objPosText[id].updateText();
        };
    }

    enableObjectDebugInformation() {
        this.gameObjectRegistry
            .subscribeObjects()
            .pipe(
                map(objs => objs.filter(obj => obj instanceof MonsterObject)),
                distinctUntilChanged(),
                map((objs: MonsterObject[]) => {
                    const updatingElementsWithoutRemoved = differenceWith(
                        Object.entries(this.updatingElements),
                        objs,
                        (id, monster) => monster.id === id[0]
                    );
                    const toAdd = differenceWith(
                        objs,
                        Object.keys(this.updatingElements),
                        (monster, id) => monster.id === id
                    ).map(obj => {
                        const debugInfo = this.translateDebugInformation(
                            obj.drawDebugInformation()
                        );
                        return [obj.id, debugInfo];
                    });
                    return fromPairs([...updatingElementsWithoutRemoved, ...toAdd]);
                }),
                tap(updatingElements => {
                    this.updatingElements = updatingElements;
                })
            )
            .subscribe();
    }

    private translateDebugInformation = (debugInformation: DebugInformation) => {
        const [type, info] = debugInformation;
        if (type === DebugShape.CIRCLE) {
            const typeInfo = info as CircleDebugInfo;
            // TODO: This will create issues when the sprite is removed from the scene.
            return () => {
                return this.drawCircle(
                    typeInfo.center(),
                    typeInfo.radius(),
                    typeInfo.color(),
                    typeInfo.alpha()
                );
            };
        }
    };

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
