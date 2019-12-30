import Vector2 = Phaser.Math.Vector2;
import { Color } from '../shared/constants';
import TweenBuilderConfig = Phaser.Types.Tweens.TweenBuilderConfig;

export enum UiShape {
    CIRCLE = 'CIRCLE',
    VECTOR = 'VECTOR',
    RECT = 'RECT',
    TEXT = 'TEXT',
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

export type TextUiInfo = {
    pos: () => Vector2;
    text: () => string;
};

export enum UiMode {
    ALL = 'ALL',
    DEBUG = 'DEBUG',
}

export type UiInformation =
    | {
          type: UiShape.CIRCLE;
          info: CircleUiInfo;
          mode: UiMode;
          tween?: string;
          hide?: () => boolean;
          trigger?: () => boolean;
      }
    | {
          type: UiShape.VECTOR;
          info: VectorUiInfo;
          mode: UiMode;
          tween?: string;
          hide?: () => boolean;
          trigger?: () => boolean;
      }
    | {
          type: UiShape.RECT;
          info: RectUIInfo;
          mode: UiMode;
          tween?: string;
          hide?: () => boolean;
          trigger?: () => boolean;
      }
    | {
          type: UiShape.TEXT;
          info: TextUiInfo;
          mode: UiMode;
          tween?: string;
          hide?: () => boolean;
          trigger?: () => boolean;
      };

export interface UiComponent {
    getUiInformation: () => UiInformation[];
}
