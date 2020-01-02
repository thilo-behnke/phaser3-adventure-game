import { container } from 'tsyringe';
import { EventRegistry } from '../event/EventRegistry';
import { map, tap } from 'rxjs/internal/operators';
import { takeRight, range } from 'lodash';
import { Color, SCREEN_HEIGHT, TILE_SIZE } from '../shared/constants';
import Text = Phaser.GameObjects.Text;
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { interval, Subscription, timer } from 'rxjs';
import Vector2 = Phaser.Math.Vector2;
import { SceneProvider } from '../scene/SceneProvider';
import Shape = Phaser.GameObjects.Shape;

export class HUDScene extends Phaser.Scene {
    private playerPosText: Text;
    private eventText: Text;
    private grid: Shape[];

    private subscriptions: Subscription[];

    create() {
        const sceneProvider = container.resolve(SceneProvider);
        const eventRegistry = container.resolve(EventRegistry);
        const gameObjectRegistry = container.resolve(GameObjectRegistry);
        // Show player pos.
        const player = gameObjectRegistry.getPlayer();
        const playerPosSub = interval(100)
            .pipe(
                map(() => player.sprite.getCenter()),
                tap((pos: Vector2) => {
                    if (this.playerPosText) {
                        this.playerPosText.destroy();
                    }
                    this.playerPosText = this.add.text(
                        5,
                        5,
                        `Player - x: ${pos.x.toFixed(2)}, y: ${pos.y.toFixed(2)}`
                    );
                })
            )
            .subscribe();
        // Show events.
        const eventSub = eventRegistry
            .get()
            .pipe(
                map(events => takeRight(events, 5)),
                tap(events => {
                    if (this.eventText) {
                        this.eventText.destroy();
                    }
                    this.eventText = this.add.text(10, SCREEN_HEIGHT - 100, events.join('\n'));
                })
            )
            .subscribe();
        this.subscriptions = [playerPosSub, eventSub];
        // Grid.
        const [mapX, mapY] = sceneProvider.getMapDimensions();
        const gridLen = TILE_SIZE,
            gridColor = Color.GREY,
            gridAlpha = 0.2;
        range(1, mapX / gridLen).forEach(pos => {
            const grid = pos * gridLen;
            // Vertical lines.
            sceneProvider.addLine(
                new Vector2(grid, 0),
                new Vector2(grid, mapY),
                gridColor,
                gridAlpha
            );
        });
        range(1, mapY / gridLen).forEach(pos => {
            const grid = pos * gridLen;
            // Horizontal lines.
            sceneProvider.addLine(
                new Vector2(0, grid),
                new Vector2(mapX, grid),
                gridColor,
                gridAlpha
            );
        });
        // TODO: Implement with config service.
        /*        if (showTileCoordinates) {
            const gridTiles = cartesianProduct(
                range(SCREEN_HEIGHT / gridLen),
                range(SCREEN_WIDTH / gridLen)
            );
            gridTiles.forEach(tilePos => {
                const [x, y] = tilePos;
                this.sceneProvider.addText(x * gridLen, y * gridLen, `${x}/${y}`, Color.GREY, 10);
            });
        }*/

        this.events.on('shutdown', () => {
            this.onShutdown();
        });
    }

    onShutdown() {
        if (this.subscriptions) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
        }
    }
}
