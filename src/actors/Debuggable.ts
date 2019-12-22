import Vector2 = Phaser.Math.Vector2;
import { Color } from '../shared/constants';

export enum DebugShape {
    CIRCLE = 'CIRCLE',
    LINE = 'LINE',
}

export type CircleDebugInfo = {
    center: () => Vector2;
    radius: () => number;
    color: () => Color;
    alpha: () => number;
};
export type LineDebugInfo = { start: () => Vector2; length: () => number };

export type DebugInformation =
    | [DebugShape.CIRCLE, CircleDebugInfo]
    | [DebugShape.LINE, LineDebugInfo];

export interface Debuggable {
    drawDebugInformation: () => DebugInformation;
}
