import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import Vector2 = Phaser.Math.Vector2;
import { Subject } from 'rxjs';

@injectable()
export class DebugService {
    constructor(private sceneProvider: SceneProvider) {}

    drawPoint(pos: Vector2): Subject<void> {
        // TODO: Better add line with right angle (=cross).
        const circle = this.sceneProvider.addCircle(pos.x, pos.y);
        const destroyCircle = new Subject<void>();
        // TODO: Does not work.
        destroyCircle.subscribe(() => circle.destroy(true));
        return destroyCircle;
    }
}
