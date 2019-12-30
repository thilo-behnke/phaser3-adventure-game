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
    CircleUiInfo,
    RectUIInfo,
    UiInformation,
    UiMode,
    UiShape,
    VectorUiInfo,
} from '../actors/UiComponent';
import { BaseGameObject } from '../actors/BaseGameObject';
import { DynamicGameObject } from '../actors/DynamicGameObject';
import Vector2 = Phaser.Math.Vector2;
import Shape = Phaser.GameObjects.Shape;
import Text = Phaser.GameObjects.Text;

enum DebugElement {
    PLAYER_POS = 'PLAYER_POS',
    OBJ_POS = '-pos',
}

@injectable()
export class UIService {
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

    configureUiInformation(mode = UiMode.ALL) {
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
                            .getUiInformation()
                            .filter(([, , itemMode]) => mode === UiMode.ALL || itemMode === mode)
                            .map(this.translateDebugInformation);
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

    private translateDebugInformation = (debugInformation: UiInformation) => {
        const [type, info] = debugInformation;
        if (type === UiShape.CIRCLE) {
            const typeInfo = info as CircleUiInfo;
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
        } else if (type === UiShape.VECTOR) {
            const typeInfo = info as VectorUiInfo;
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
        } else if (type === UiShape.RECT) {
            const typeInfo = info as RectUIInfo;
            const rect = this.drawRect(
                typeInfo
                    .start()
                    .clone()
                    .add(new Vector2(typeInfo.baseWidth() / 2, typeInfo.height() / 2)),
                typeInfo.width(),
                typeInfo.height(),
                typeInfo.color(),
                typeInfo.alpha()
            );
            return {
                shape: rect,
                update: () => {
                    const { x: startX, y: startY } = typeInfo
                        .start()
                        .clone()
                        .add(new Vector2(typeInfo.baseWidth() / 2, typeInfo.height() / 2));
                    rect.setX(startX);
                    rect.setY(startY);
                    rect.width = typeInfo.width();
                    rect.height = typeInfo.height();
                },
                destroy: () => rect.destroy(),
            };
        } else {
            throw new Error(`Unknown UiShape: ${type}`);
        }
    };

    drawPath(paths: Vector2[]): Subject<void> {
        const vectors = [];
        for (let i = 0; i < paths.length; i++) {
            if (i === 0) {
                continue;
            }
            vectors.push(this.drawVector(paths[i - 1], paths[i]));
        }
        return this.createDestructor(...vectors);
    }

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
    }

    drawRect(start: Vector2, width: number, height: number, color: Color, alpha: number) {
        return this.sceneProvider.addRect(start.x, start.y, width, height, color, alpha);
    }

    drawHealthBar(obj: DynamicGameObject) {
        const start = obj.sprite.getTopLeft();

        const frame = this.sceneProvider.addRect(
            start.x,
            start.y - 20,
            obj.sprite.width,
            10,
            Color.GREY,
            1
        );
        return this.createDestructor(frame);
    }

    private createDestructor = (...shapes: Shape[]) => {
        const destructor = new Subject<void>();
        destructor.subscribe(() => shapes.forEach(s => s.destroy(true)));
        return destructor;
    };
}
