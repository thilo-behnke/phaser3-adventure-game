import Vector2 = Phaser.Math.Vector2;
import { MonsterObject } from '../actors/MonsterObject';
import Sprite = Phaser.Physics.Arcade.Sprite;

export interface PathFinding {
    moveTo: (monster: MonsterObject, goal: Vector2 | Sprite) => void;
    reset: () => void;
}
