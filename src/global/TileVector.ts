import Tile = Phaser.Tilemaps.Tile;
import Vector2 = Phaser.Math.Vector2;
import { not } from '../util/fp';

export class TileVector {
    private readonly _pos: Vector2;
    private readonly _tilePos: Vector2;

    constructor(private tile: Tile) {
        this._pos = new Vector2(tile.pixelX, tile.pixelY);
        this._tilePos = new Vector2(tile.x, tile.y);
    }

    collides = () => {
        return !!this.tile.properties.collides;
    };

    equals = (obj: TileVector) => {
        return obj.tilePos.equals(this.tilePos);
    };

    get pos(): Phaser.Math.Vector2 {
        return this._pos;
    }
    get tilePos(): Phaser.Math.Vector2 {
        return this._tilePos;
    }
}

export class TileVectorSet implements Set<TileVector> {
    readonly [Symbol.toStringTag]: string;
    readonly _size: number;

    private tileVectors: Map<Vector2, TileVector> = new Map();

    get size() {
        return this.tileVectors.size;
    }

    [Symbol.iterator](): IterableIterator<TileVector> {
        return this.tileVectors.values()[Symbol.iterator]();
    }

    add(value: TileVector): this {
        const existing = this.tileVectors.get(value.tilePos);
        if (existing) {
            return;
        }
        this.tileVectors.set(value.tilePos, value);
    }

    clear(): void {
        this.tileVectors = new Map();
    }

    delete(value: TileVector): boolean {
        return this.tileVectors.delete(value.tilePos);
    }

    entries(): IterableIterator<[TileVector, TileVector]> {
        const mappedEntries: Array<[TileVector, TileVector]> = [
            ...this.tileVectors.entries(),
        ].map(([, value]) => [value, value]);
        return mappedEntries[Symbol.iterator]();
    }

    forEach(
        callbackfn: (value: TileVector, value2: TileVector, set: Set<TileVector>) => void,
        thisArg?: any
    ): void {
        return new Set(this.tileVectors.values()).forEach(callbackfn, thisArg);
    }

    has(value: TileVector): boolean {
        return !!this.tileVectors.get(value.tilePos);
    }

    keys(): IterableIterator<TileVector> {
        return this.tileVectors.values();
    }

    values(): IterableIterator<TileVector> {
        return this.tileVectors.values();
    }
}
