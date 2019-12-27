import Tile = Phaser.Tilemaps.Tile;
import Vector2 = Phaser.Math.Vector2;

export class TileVector {
    private readonly _pos: Vector2;
    private readonly _tilePos: Vector2;

    constructor(private tile: Tile) {
        // TODO: This works, but it would be better if the sprite would check its own height / width to properly navigate colliding tiles.
        this._pos = new Vector2(
            tile.pixelX + tile.baseWidth / 2,
            tile.pixelY + tile.baseHeight / 2
        );
        this._tilePos = new Vector2(tile.x, tile.y);
    }

    collides = () => {
        return !!this.tile.properties.collides;
    };

    equals = (obj: TileVector) => {
        return obj.tilePos.equals(this.tilePos);
    };

    toKey = () => {
        return `${this.tilePos.x}/${this.tilePos.y}`;
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

    private tileVectors: Map<string, TileVector> = new Map();

    static from(tileVectors: TileVector[]) {
        const set = new TileVectorSet();
        tileVectors.forEach(tileVector => set.add(tileVector));
        return set;
    }

    get size() {
        return this.tileVectors.size;
    }

    [Symbol.iterator](): IterableIterator<TileVector> {
        return this.tileVectors.values()[Symbol.iterator]();
    }

    add(value: TileVector): this {
        const existing = this.tileVectors.get(value.toKey());
        if (existing) {
            return;
        }
        this.tileVectors.set(value.toKey(), value);
    }

    clear(): void {
        this.tileVectors = new Map();
    }

    delete(value: TileVector): boolean {
        return this.tileVectors.delete(value.toKey());
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
        return !!this.tileVectors.get(value.toKey());
    }

    keys(): IterableIterator<TileVector> {
        return this.tileVectors.values();
    }

    values(): IterableIterator<TileVector> {
        return this.tileVectors.values();
    }
}
