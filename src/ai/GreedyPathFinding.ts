import { PathFinding } from './PathFinding';
import { MonsterObject } from '../actors/MonsterObject';
import { injectable } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import Vector2 = Phaser.Math.Vector2;

@injectable()
export class GreedyPathFinding implements PathFinding {
    private _intermediateGoal: Vector2 | null;
    // Instead of recalculating an intermediateGoal every frame, only do it every couple of them.
    private _intermediateCounter: number | null;
    INTERMEDIATE_MAX_COUNTER = 20;

    constructor(private sceneProvider: SceneProvider) {}

    get intermediateGoal(): Phaser.Math.Vector2 | null {
        return this._intermediateGoal;
    }

    set intermediateGoal(value: Phaser.Math.Vector2 | null) {
        this._intermediateGoal = value;
        if (this._intermediateGoal === null) {
            this._intermediateCounter = 0;
        } else {
            this._intermediateCounter = this.INTERMEDIATE_MAX_COUNTER;
        }
    }

    get intermediateCounter(): number | null {
        const current = this._intermediateCounter;
        this._intermediateCounter -= 1;
        return current;
    }

    moveTo = (monster: MonsterObject, pos: Phaser.Math.Vector2) => {
        // If their are colliding goals in the way, the monster can't just go straight, but must evade the concerned tiles.
        // TODO: Inefficient!
        const tilesToGoal = [
            ...this.sceneProvider.getTilesToGoal(monster.sprite.getTopLeft(), pos),
            ...this.sceneProvider.getTilesToGoal(monster.sprite.getTopRight(), pos),
            ...this.sceneProvider.getTilesToGoal(monster.sprite.getBottomLeft(), pos),
            ...this.sceneProvider.getTilesToGoal(monster.sprite.getBottomRight(), pos),
        ];
        if (tilesToGoal.every(({ properties: { collides } }) => !collides)) {
            this.intermediateGoal = null;
            monster.accelerateTowards(pos);
        } else if (this.intermediateCounter > 0) {
            monster.accelerateTowards(this.intermediateGoal);
        } else {
            const adjacentTiles = this.sceneProvider
                .getAdjacentTilesFromPos(monster.sprite.getCenter())
                .filter(({ properties: { collides } }) => !collides)
                .map(tile => new Vector2(tile.pixelX, tile.pixelY));

            const closestTilePos = adjacentTiles.reduce((best, next) => {
                const length = pos
                    .clone()
                    .subtract(next)
                    .length();
                console.log(next, this.sceneProvider.getTileForPos(next), length, best.length());
                if (
                    length <
                    pos
                        .clone()
                        .subtract(best)
                        .length()
                ) {
                    return next;
                } else {
                    return best;
                }
            });
            console.log(
                `New intermediate Goal: `,
                closestTilePos,
                this.sceneProvider.getTileForPos(closestTilePos).value
            );
            // TODO: Further increase attention radius? How to reset to which value?
            this.intermediateGoal = this.sceneProvider.getTileCenter(
                this.sceneProvider.getTileForPos(closestTilePos).value
            );
            monster.accelerateTowards(this.intermediateGoal);
        }
    };
}
