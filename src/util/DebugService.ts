import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import Vector2 = Phaser.Math.Vector2;
import { Subject } from 'rxjs';
import Shape = Phaser.GameObjects.Shape;
import { BaseGameObject } from '../actors/BaseGameObject';
import { GameObjectRegistry } from '../registry/GameObjectRegistry';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../shared/constants';

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

    showPlayerPos() {
        this.updatingElements.push(() => {
            const playerPos = this.gameObjectRegistry.getPlayer().sprite.getCenter();
            const newText = `Player - x: ${playerPos.x.toFixed(2)}, y: ${playerPos.y.toFixed(2)}`;
            if (!this.playerPosText) {
                this.playerPosText = this.sceneProvider.addText(SCREEN_WIDTH - 300, 100, newText);
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
                    newText
                );
                return;
            }
            this.objPosText[id].setText(newText);
            this.objPosText[id].updateText();
        });
    }

    drawPoint(pos: Vector2): Subject<void> {
        // TODO: Better add line with right angle (=cross).
        const circle = this.sceneProvider.addCircle(pos.x, pos.y);
        return this.createDestructor(circle);
    }

    drawVector(from: Vector2, to: Vector2) {
        const vector = this.sceneProvider.addVector(from, to);
        return this.createDestructor(vector);
    }

    private createDestructor = (s: Shape) => {
        const destructor = new Subject<void>();
        // TODO: Does not work.
        destructor.subscribe(() => s.destroy(true));
        return destructor;
    };
}
