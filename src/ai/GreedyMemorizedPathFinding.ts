import { PathFinding } from './PathFinding';
import { MonsterObject } from '../actors/MonsterObject';
import { SceneProvider } from '../scene/SceneProvider';
import { TileVector, TileVectorSet } from '../global/TileVector';
import { container } from 'tsyringe';
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.Physics.Arcade.Sprite;
import { TILE_SIZE } from '../shared/constants';

export class GreedyMemorizedPathFinding implements PathFinding {
    private intermediateGoals: TileVector[] | null = null;
    private currentIntermediateGoal: number | null;
    private sceneProvider: SceneProvider;

    private PATH_FINDING_RESET_DISTANCE = TILE_SIZE ** 2; // 1 Tile in distance

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
        const tilesToGoal = this.sceneProvider.getTilesToGoal(currentPos, goalTile.center);
        if (tilesToGoal.every((tileVector: TileVector) => !tileVector.collides())) {
            return [true, [...path, goalTile]];
        }

        // Else observe the adjacent tiles and try to find the goal from choosing the next best tile.
        const adjacentTiles = this.sceneProvider
            .getAdjacentTileVectorsFromPos(currentPos.center)
            // Don't revisit visited tiles.
            .filter((tile: TileVector) => !visited.has(tile) && !tile.collides());
        // If there are no more new adjacent tiles to move to, stop.
        if (!adjacentTiles.length) {
            return [false, null];
        }
        const tilesSortedByPreference = adjacentTiles.sort((a: TileVector, b: TileVector) => {
            const lengthA = goalTile.center
                .clone()
                .subtract(a.center)
                .length();
            const lengthB = goalTile.center
                .clone()
                .subtract(b.center)
                .length();
            return lengthA - lengthB;
        });
        const newIntermediateGoal = tilesSortedByPreference[0];
        tilesSortedByPreference.forEach(rest => visited.add(rest));
        return this.greedyFindGoal(
            goalTile,
            newIntermediateGoal,
            [...path, newIntermediateGoal],
            visited
        );
    };

    moveTo = (monster: MonsterObject, goal: Vector2 | Sprite) => {
        const goalPos = goal instanceof Vector2 ? goal : goal.getCenter();
        // If the goal has moved too far, stop following the intermediate goal and repeat the path checking (there might be a better path now...).
        if (
            this.intermediateGoals &&
            this.intermediateGoals[this.intermediateGoals.length - 1].center
                .clone()
                .distance(goalPos) > this.PATH_FINDING_RESET_DISTANCE
        ) {
            this.reset();
        } else if (this.intermediateGoals) {
            // Has monster reached the intermediate goal?
            if (
                this.sceneProvider.areOnSameTile(
                    monster.sprite.getCenter(),
                    this.intermediateGoals[this.currentIntermediateGoal].center
                )
            ) {
                this.currentIntermediateGoal++;
                // If there are no more steps to go, stop following the path and reset the variables.
                if (this.currentIntermediateGoal >= this.intermediateGoals.length) {
                    this.reset();
                    return;
                }
            }
            monster.accelerateTowards(this.intermediateGoals[this.currentIntermediateGoal].center);
            return;
        }
        // If their are colliding goals in the way, the monster can't just go straight, but must evade the concerned tiles.
        const tilesToGoal = this.sceneProvider.getTilesToGoal(monster.sprite, goal);
        if (tilesToGoal.every((tileVector: TileVector) => !tileVector.collides())) {
            this.intermediateGoals = null;
            monster.accelerateTowards(goalPos);
        } else {
            const goalTile = this.sceneProvider.getTileVectorForPos(goalPos).value;
            const [success, path] = this.greedyFindGoal(
                goalTile,
                this.sceneProvider.getTileVectorForPos(monster.sprite.getCenter()).value
            );
            if (!success) {
                this.reset();
                return;
            }
            this.intermediateGoals = path;
            this.currentIntermediateGoal = 0;

            monster.accelerateTowards(this.intermediateGoals[this.currentIntermediateGoal].center);
        }
    };

    reset = () => {
        this.intermediateGoals = null;
        this.currentIntermediateGoal = null;
    };
}
