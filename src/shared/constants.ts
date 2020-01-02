export const SCREEN_WIDTH = 800;
export const SCREEN_HEIGHT = 800;
export const TILE_SIZE = 32;

export enum Color {
    WHITE = 0xffffff,
    BLACK = 0x000000,
    GREY = 0xe8e8e8,
    RED = 0xd11141,
}

export enum SceneName {
    MAIN_MENU = 'MAIN_MENU',
    EXPLORATION = 'EXPLORATION',
    HUD = 'HUD',
    OVERLAY_MENU = 'OVERLAY_MENU',
}

export enum Z_INDEX {
    DEAD = 0,
    DEFAULT = 1,
    PLAYER = 2,
}

export const generateConfig = (scene: typeof Phaser.Scene) => {
    return {
        type: Phaser.WEBGL,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        scene: scene,
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: { debug: true },
        },
    };
};
