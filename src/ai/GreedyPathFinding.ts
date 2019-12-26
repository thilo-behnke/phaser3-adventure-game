import { PathFinding } from './PathFinding';
import { MonsterObject } from '../actors/MonsterObject';
import { injectable, singleton } from 'tsyringe';
import { SceneProvider } from '../scene/SceneProvider';
import { isCloseTo } from '../util/collision';
import Vector2 = Phaser.Math.Vector2;

@injectable()
export class GreedyPathFinding implements PathFinding {
    private intermediateGoal: Vector2 | null;

    constructor(private sceneProvider: SceneProvider) {}

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
