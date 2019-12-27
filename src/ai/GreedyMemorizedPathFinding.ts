import { PathFinding } from './PathFinding';
import { MonsterObject } from '../actors/MonsterObject';
import { SceneProvider } from '../scene/SceneProvider';
import { TileVector, TileVectorSet } from '../global/TileVector';
import { container } from 'tsyringe';
import Vector2 = Phaser.Math.Vector2;
import Sprite = Phaser.Physics.Arcade.Sprite;

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

    moveTo = (monster: MonsterObject, goal: Vector2 | Sprite) => {
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
        const goalPos = goal instanceof Vector2 ? goal : goal.getCenter();
        // If their are colliding goals in the way, the monster can't just go straight, but must evade the concerned tiles.
        // TODO: Inefficient! At least filter duplicates.
        const tilesToGoal =
            goal instanceof Vector2
                ? [
                      this.sceneProvider.getNextTileToGoal(monster.sprite.getTopLeft(), goal),
                      this.sceneProvider.getNextTileToGoal(monster.sprite.getTopRight(), goal),
                      this.sceneProvider.getNextTileToGoal(monster.sprite.getBottomLeft(), goal),
                      this.sceneProvider.getNextTileToGoal(monster.sprite.getBottomRight(), goal),
                  ]
                : [
                      this.sceneProvider.getNextTileToGoal(
                          monster.sprite.getTopLeft(),
                          goal.getTopLeft()
                      ),
                      this.sceneProvider.getNextTileToGoal(
                          monster.sprite.getTopRight(),
                          goal.getTopRight()
                      ),
                      this.sceneProvider.getNextTileToGoal(
                          monster.sprite.getBottomLeft(),
                          goal.getBottomLeft()
                      ),
                      this.sceneProvider.getNextTileToGoal(
                          monster.sprite.getBottomRight(),
                          goal.getBottomRight()
                      ),
                  ];
        if (tilesToGoal.every(({ properties: { collides } }) => !collides)) {
            this.intermediateGoals = null;
            monster.accelerateTowards(goalPos);
        } else {
            const goalTile = this.sceneProvider.getTileVectorForPos(goalPos).value;
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
