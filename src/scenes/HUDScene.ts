import { container } from 'tsyringe';
import { EventRegistry } from '../event/EventRegistry';
import { map, tap } from 'rxjs/internal/operators';
import { takeRight } from 'lodash';
import { SCREEN_HEIGHT } from '../shared/constants';
import Text = Phaser.GameObjects.Text;
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { interval, timer } from 'rxjs';
import Vector2 = Phaser.Math.Vector2;

export class HUDScene extends Phaser.Scene {
    private playerPosText: Text;
    private eventText: Text;

    create() {
        const eventRegistry = container.resolve(EventRegistry);
        const gameObjectRegistry = container.resolve(GameObjectRegistry);
        // Show player pos.
        const player = gameObjectRegistry.getPlayer();
        interval(100)
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
        eventRegistry
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
    }
}
