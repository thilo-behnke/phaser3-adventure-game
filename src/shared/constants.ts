export const SCREEN_WIDTH = 960;
export const SCREEN_HEIGHT = 540;
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
    INVENTORY = 'INVENTORY',
    OVERLAY_MENU = 'OVERLAY_MENU',
}

export enum Z_INDEX {
    DEAD = 0,
    DEFAULT = 1,
    PLAYER = 2,
}

export const generateConfig = (scene: typeof Phaser.Scene) => {
    return {
        type: Phaser.AUTO,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        scene: scene,
        pixelArt: true,
        physics: {
            default: 'arcade',
            fps: 60,
        },
    };
};
