import Vector2 = Phaser.Math.Vector2;
import { Color } from '../shared/constants';

export enum DebugShape {
    CIRCLE = 'CIRCLE',
    VECTOR = 'VECTOR',
}

export type CircleDebugInfo = {
    center: () => Vector2;
    radius: () => number;
    color: () => Color;
    alpha: () => number;
};
export type VectorDebugInfo = { start: () => Vector2; end: () => Vector2 };

export type DebugInformation =
    | [DebugShape.CIRCLE, CircleDebugInfo]
    | [DebugShape.VECTOR, VectorDebugInfo];

export interface Debuggable {
    drawDebugInformation: () => DebugInformation[];
}
