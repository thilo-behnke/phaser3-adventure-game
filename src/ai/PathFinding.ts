import Vector2 = Phaser.Math.Vector2;
import { MonsterObject } from '../actors/MonsterObject';

export interface PathFinding {
    moveTo: (monster: MonsterObject, pos: Vector2) => void;
}
