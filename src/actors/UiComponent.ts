import Vector2 = Phaser.Math.Vector2;
import { Color } from '../shared/constants';

export enum UiShape {
    CIRCLE = 'CIRCLE',
    VECTOR = 'VECTOR',
    RECT = 'RECT',
}

export type CircleUiInfo = {
    center: () => Vector2;
    radius: () => number;
    color: () => Color;
    alpha: () => number;
};
export type VectorUiInfo = { start: () => Vector2; end: () => Vector2 };
export type RectUIInfo = {
    start: () => Vector2;
    // Important for determining the real start position (not center) of the rect in case the width changes.
    baseWidth: () => number;
    width: () => number;
    height: () => number;
    color: () => Color;
    alpha: () => number;
};

export enum UiMode {
    ALL = 'ALL',
    DEBUG = 'DEBUG',
}

export type UiInformation =
    | [UiShape.CIRCLE, CircleUiInfo, UiMode]
    | [UiShape.VECTOR, VectorUiInfo, UiMode]
    | [UiShape.RECT, RectUIInfo, UiMode];

export interface UiComponent {
    getUiInformation: () => UiInformation[];
}
