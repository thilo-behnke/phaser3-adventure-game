import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { Subject } from 'rxjs';
import { differenceWith, flatten, fromPairs, range, size } from 'lodash';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { Color, SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';
import { cartesianProduct } from './general';
import { distinctUntilChanged, map, tap } from 'rxjs/internal/operators';
import { MonsterObject } from '../actors/MonsterObject';
import {
    CircleDebugInfo,
    DebugInformation,
    DebugShape,
    VectorDebugInfo,
} from '../actors/Debuggable';
import Vector2 = Phaser.Math.Vector2;
import Shape = Phaser.GameObjects.Shape;
import Text = Phaser.GameObjects.Text;
import { BaseGameObject } from '../actors/BaseGameObject';
import get = Reflect.get;

enum DebugElement {
    PLAYER_POS = 'PLAYER_POS',
    OBJ_POS = '-pos',
}

@injectable()
export class DebugService {
    private updatingElements: {
        [key: string]: { shape: Shape | Text; update: Function; destroy: Function };
    } = {};

    constructor(
        private sceneProvider: SceneProvider,
        private gameObjectRegistry: GameObjectRegistry
    ) {}

    update() {
        Object.values(this.updatingElements).forEach(({ update }) => update());
    }

    showGrid(showTileCoordinates = false) {
        const gridLen = 32,
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
                this.sceneProvider.addText(x * gridLen, y * gridLen, `${x}/${y}`, Color.GREY, 10);
            });
        }
    }

    showPlayerPos() {
        const playerPos = this.gameObjectRegistry.getPlayer().sprite.getCenter();
        const newText = `Player - x: ${playerPos.x.toFixed(2)}, y: ${playerPos.y.toFixed(2)}`;
        const playerPosText = this.sceneProvider.addText(0, 0, newText, Color.WHITE, 16);
        this.updatingElements[DebugElement.PLAYER_POS] = {
            shape: playerPosText,
            update: () => {
                const playerPos = this.gameObjectRegistry.getPlayer().sprite.getCenter();
                const newText = `Player - x: ${playerPos.x.toFixed(2)}, y: ${playerPos.y.toFixed(
                    2
                )}`;
                playerPosText.setText(newText);
                playerPosText.updateText();
            },
            destroy: () => playerPosText.destroy(),
        };
    }

    showObjectPos(id: string) {
        const getObj = () => {
            return this.gameObjectRegistry.getById(id);
        };
        const generateText = (obj: BaseGameObject) => {
            return `Obj - x: ${obj.sprite.x.toFixed(2)}, y: ${obj.sprite.y.toFixed(2)}`;
        };
        const obj = getObj();
        if (obj.isEmpty()) {
            return;
        }
        const initialText = generateText(obj.value);
        const objPosText = this.sceneProvider.addText(
            0,
            size(this.updatingElements) * 20,
            initialText,
            Color.WHITE,
            16
        );
        this.updatingElements[`${id}-${DebugElement.OBJ_POS}`] = {
            shape: objPosText,
            update: () => {
                const obj = getObj();
                if (obj.isEmpty()) {
                    return;
                }
                const newText = generateText(obj.value);
                objPosText.setText(newText);
                objPosText.updateText();
            },
            destroy: () => objPosText.destroy(),
        };
    }

    enableObjectDebugInformation() {
        this.gameObjectRegistry
            .subscribeObjects()
            .pipe(
                map(objs => objs.filter(obj => obj instanceof MonsterObject)),
                distinctUntilChanged(),
                map((objs: MonsterObject[]) => {
                    const updatingElementsWithoutRemoved = Object.entries(
                        this.updatingElements
                    ).filter(existing => {
                        if (!existing.includes('--debug')) {
                            return true;
                        }
                        const debugId = existing[0].split('--debug')[0];
                        return objs.some(monster => monster.id === debugId);
                    });
                    const toAdd = differenceWith(
                        objs,
                        Object.keys(this.updatingElements).map(id => id.split('--debug')[0]),
                        (monster, id) => monster.id === id
                    ).map(obj => {
                        const debugInfoItems = obj
                            .drawDebugInformation()
                            .map(debugInfo => this.translateDebugInformation(debugInfo));
                        return debugInfoItems.map((item, index) => [
                            `${obj.id}--debug--${index}`,
                            item,
                        ]);
                    });
                    return fromPairs([...updatingElementsWithoutRemoved, ...flatten(toAdd)]);
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
            const circle = this.drawCircle(
                typeInfo.center(),
                typeInfo.radius(),
                typeInfo.color(),
                typeInfo.alpha()
            );
            return {
                shape: circle,
                update: () => {
                    const { x, y } = typeInfo.center();
                    circle.setPosition(x, y);
                    circle.setRadius(typeInfo.radius());
                    circle.setFillStyle(typeInfo.color(), typeInfo.alpha());
                },
                destroy: () => circle.destroy(),
            };
        } else if (type === DebugShape.VECTOR) {
            const typeInfo = info as VectorDebugInfo;
            const vector = this.drawVector(typeInfo.start(), typeInfo.end());
            return {
                shape: vector,
                update: () => {
                    const { x: startX, y: startY } = typeInfo.start();
                    const { x: endX, y: endY } = typeInfo.end();
                    vector.setTo(startX, startY, endX, endY);
                },
                destroy: () => vector.destroy(),
            };
        }
    };

    drawPoint(pos: Vector2): Subject<void> {
        // TODO: Better add line with right angle (=cross).
        const circle = this.sceneProvider.addCircle(pos.x, pos.y, 2);
        return this.createDestructor(circle);
    }

    drawCircle(center: Vector2, radius: number, color = Color.BLACK, alpha = 1) {
        return this.sceneProvider.addCircle(center.x, center.y, radius, color, alpha);
    }

    drawVector(from: Vector2, to: Vector2) {
        const vector = this.sceneProvider.addVector(from, to);
        return vector;
        /*        const point = this.sceneProvider.addCircle(to.x, to.y, Color.BLACK);*/
    }

    private createDestructor = (...shapes: Shape[]) => {
        const destructor = new Subject<void>();
        destructor.subscribe(() => shapes.forEach(s => s.destroy(true)));
        return destructor;
    };
}
