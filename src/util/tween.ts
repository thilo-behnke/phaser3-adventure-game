import GameObject = Phaser.GameObjects.GameObject;

export enum AvailableTweens {
    FADE_OUT_TOP = 'FADE_OUT_TOP',
}

export const fadeOutTop = (obj: GameObject) => {
    return {
        targets: obj,
        y: '-=10',
        x: '+=2',
        ease: 'Linear',
        duration: 2000,
        onComplete: () => obj.destroy(),
    };
};

export const getTweenByName = (name: AvailableTweens) => {
    if (name === AvailableTweens.FADE_OUT_TOP) {
        return fadeOutTop;
    } else {
        throw new Error(`No tween found with name ${name}!`);
    }
};
