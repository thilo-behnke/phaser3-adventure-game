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

export const generateConfig = (scene: typeof Phaser.Scene) => {
    return {
        type: Phaser.AUTO,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        scene: scene,
        physics: {
            default: 'arcade',
            arcade: { debug: true },
        },
    };
};
