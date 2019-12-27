import { PathFinding } from './PathFinding';
import { MonsterObject } from '../actors/MonsterObject';
import { SceneProvider } from '../scene/SceneProvider';
import { TileVector, TileVectorSet } from '../global/TileVector';
import { container } from 'tsyringe';
import Vector2 = Phaser.Math.Vector2;

export class GreedyMemorizedPathFinding implements PathFinding {
    private intermediateGoals: TileVector[] | null = null;
    private currentIntermediateGoal: number | null;
    private sceneProvider: SceneProvider;

    constructor() {
        this.sceneProvider = container.resolve(SceneProvider);
    }

    private greedyFindGoal = (
        goalTile: TileVector,
        currentPos: TileVector,
        path: TileVector[] = [],
        visited: TileVectorSet = new TileVectorSet()
    ) => {
        // If the goal is reached, stop here.
        const hasReachedGoal = path.length && path[path.length - 1].equals(goalTile);
        if (hasReachedGoal) {
            return [true, path];
        }
        // Else observe the adjacent tiles and try to find the goal from choosing the next best tile.
        const adjacentTiles = this.sceneProvider
            .getAdjacentTileVectorsFromPos(currentPos.pos)
            // Don't revisit visited tiles.
            .filter((tile: TileVector) => !visited.has(tile) && !tile.collides());
        // If there are no more new adjacent tiles to move to, stop.
        if (!adjacentTiles.length) {
            return [false, null];
        }
        const tilesSortedByPreference = adjacentTiles.sort((a, b) => {
            const lengthA = goalTile.pos
                .clone()
                .subtract(a.pos)
                .length();
            const lengthB = goalTile.pos
                .clone()
                .subtract(b.pos)
                .length();
            return lengthA - lengthB;
        });
        const newIntermediateGoal = tilesSortedByPreference[0];
        tilesSortedByPreference.slice(1).forEach(rest => visited.add(rest));
        return this.greedyFindGoal(
            goalTile,
            newIntermediateGoal,
            [...path, newIntermediateGoal],
            visited
        );
    };

    moveTo = (monster: MonsterObject, pos: Vector2) => {
        if (this.intermediateGoals) {
            // Has monster reached the intermediate goal?
            if (
                this.sceneProvider.areOnSameTile(
                    monster.sprite.getCenter(),
                    this.intermediateGoals[this.currentIntermediateGoal].pos
                )
            ) {
                this.currentIntermediateGoal++;
                // If there are no more steps to go, stop following the path and reset the variables.
                if (this.currentIntermediateGoal >= this.intermediateGoals.length) {
                    this.intermediateGoals = null;
                    this.currentIntermediateGoal = null;
                    return;
                }
            }
            monster.accelerateTowards(this.intermediateGoals[this.currentIntermediateGoal].pos);
            return;
        }
        // If their are colliding goals in the way, the monster can't just go straight, but must evade the concerned tiles.
        // TODO: Inefficient! At least filter duplicates.
        const tilesToGoal = [
            this.sceneProvider.getNextTileToGoal(monster.sprite.getTopLeft(), pos),
            this.sceneProvider.getNextTileToGoal(monster.sprite.getTopRight(), pos),
            this.sceneProvider.getNextTileToGoal(monster.sprite.getBottomLeft(), pos),
            this.sceneProvider.getNextTileToGoal(monster.sprite.getBottomRight(), pos),
        ];
        if (tilesToGoal.every(({ properties: { collides } }) => !collides)) {
            this.intermediateGoals = null;
            monster.accelerateTowards(pos);
        } else {
            const goalTile = this.sceneProvider.getTileVectorForPos(pos).value;
            const [success, path] = this.greedyFindGoal(
                goalTile,
                this.sceneProvider.getTileVectorForPos(monster.sprite.getCenter()).value
            );
            if (!success) {
                this.intermediateGoals = null;
                return;
            }
            this.intermediateGoals = path;
            this.currentIntermediateGoal = 0;

            monster.accelerateTowards(this.intermediateGoals[this.currentIntermediateGoal].pos);
        }
    };
}
