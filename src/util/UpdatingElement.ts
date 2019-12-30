import Shape = Phaser.GameObjects.Shape;
import Arc = Phaser.GameObjects.Arc;
import Line = Phaser.GameObjects.Line;
import Vector2 = Phaser.Math.Vector2;
import Rectangle = Phaser.GameObjects.Rectangle;
import Text = Phaser.GameObjects.Text;
import {
    CircleUiInfo,
    RectUIInfo,
    TextUiInfo,
    UiInformation,
    VectorUiInfo,
} from '../actors/UiComponent';
import { SceneProvider } from '../scene/SceneProvider';
import { container } from 'tsyringe';
import { Color } from '../shared/constants';
import { AvailableTweens, getTweenByName } from './tween';

export interface UpdatingElement<T extends Shape | Text> {
    // Shape can be undefined if not yet created.
    shape?: T;

    initialize: () => void;
    update: () => void;
    destroy: () => void;
}

export class CircleUpdatingElement implements UpdatingElement<Arc> {
    shape: Arc;
    private sceneProvider: SceneProvider;

    constructor(private typeInfo: CircleUiInfo, private uiInfo: UiInformation) {
        this.sceneProvider = container.resolve(SceneProvider);
    }

    initialize = () => {
        this.shape = this.sceneProvider.addCircle(
            this.typeInfo.center().x,
            this.typeInfo.center().y,
            this.typeInfo.radius(),
            this.typeInfo.color(),
            this.typeInfo.alpha()
        );
    };

    update = () => {
        if (this.uiInfo.hide && this.uiInfo.hide()) {
            return;
        }
        if (!this.shape) {
            this.initialize();
            return;
        }
        const { x, y } = this.typeInfo.center();
        this.shape.setPosition(x, y);
        this.shape.setRadius(this.typeInfo.radius());
        this.shape.setFillStyle(this.typeInfo.color(), this.typeInfo.alpha());
    };

    destroy = () => {
        this.shape.destroy();
    };
}

export class VectorUpdatingElement implements UpdatingElement<Line> {
    shape: Line;
    private sceneProvider: SceneProvider;

    constructor(private typeInfo: VectorUiInfo, private uiInfo: UiInformation) {
        this.sceneProvider = container.resolve(SceneProvider);
    }

    initialize = () => {
        this.shape = this.sceneProvider.addVector(this.typeInfo.start(), this.typeInfo.end());
    };

    update = () => {
        if (this.uiInfo.hide && this.uiInfo.hide()) {
            return;
        }
        if (!this.shape) {
            this.initialize();
            return;
        }
        const { x: startX, y: startY } = this.typeInfo.start();
        const { x: endX, y: endY } = this.typeInfo.end();
        this.shape.setTo(startX, startY, endX, endY);
    };

    destroy = () => {
        this.shape.destroy();
    };
}

export class RectUpdatingElement implements UpdatingElement<Rectangle> {
    shape: Rectangle;
    private sceneProvider: SceneProvider;

    constructor(private typeInfo: RectUIInfo, private uiInfo: UiInformation) {
        this.sceneProvider = container.resolve(SceneProvider);
    }

    initialize = () => {
        const start = this.typeInfo
            .start()
            .clone()
            .add(new Vector2(this.typeInfo.baseWidth() / 2, this.typeInfo.height() / 2));
        this.shape = this.sceneProvider.addRect(
            start.x,
            start.y,
            this.typeInfo.width(),
            this.typeInfo.height(),
            this.typeInfo.color(),
            this.typeInfo.alpha()
        );
    };

    update = () => {
        if (this.uiInfo.hide && this.uiInfo.hide()) {
            return;
        }
        if (!this.shape) {
            this.initialize();
            return;
        }
        const { x: startX, y: startY } = this.typeInfo
            .start()
            .clone()
            .add(new Vector2(this.typeInfo.baseWidth() / 2, this.typeInfo.height() / 2));
        this.shape.setX(startX);
        this.shape.setY(startY);
        this.shape.width = this.typeInfo.width();
        this.shape.height = this.typeInfo.height();
    };

    destroy = () => {
        this.shape.destroy();
    };
}

export class TextUpdatingElement implements UpdatingElement<Text> {
    shape: Text;
    private sceneProvider: SceneProvider;

    constructor(private typeInfo: TextUiInfo, private uiInfo: UiInformation) {
        this.sceneProvider = container.resolve(SceneProvider);
    }

    initialize = () => {
        this.shape = this.sceneProvider.addText(
            this.typeInfo.pos().x,
            this.typeInfo.pos().y,
            this.typeInfo.text(),
            Color.RED,
            10
        );
        if (this.uiInfo.tween) {
            const tweenDef = getTweenByName(this.uiInfo.tween as AvailableTweens);
            this.sceneProvider.addTween(tweenDef(this.shape));
        }
    };

    update = () => {
        if (this.uiInfo.hide && this.uiInfo.hide()) {
            return;
        }
        if (!this.shape) {
            this.initialize();
            return;
        }
        if (this.uiInfo.trigger && this.uiInfo.trigger()) {
            this.destroy();
            this.initialize();
            return;
        }
        if (this.uiInfo.tween) {
            return;
        }
        const { x: startX, y: startY } = this.typeInfo.pos();
        this.shape.setX(startX);
        this.shape.setY(startY);
        this.shape.setText(this.typeInfo.text());
    };

    destroy = () => {
        this.shape.destroy();
    };
}
