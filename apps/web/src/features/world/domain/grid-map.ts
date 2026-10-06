/** A map as a grid: 1 tile = 1 world unit. Tiled's x axis is x, Tiled's y axis is z. */
export interface TileInfo {
  readonly color: string;
  /** Extrusion height in tiles; 0 is floor. */
  readonly height: number;
  readonly collides: boolean;
}

export interface Block extends TileInfo {
  readonly x: number;
  readonly z: number;
}

export interface GridMap {
  readonly width: number;
  readonly height: number;
  /** Pixels per tile in the source map; converts API positions into tiles. */
  readonly tileSize: number;
  readonly floor: readonly Block[];
  readonly blocks: readonly Block[];
  /** True where the player cannot stand. Index = z * width + x. */
  readonly solid: readonly boolean[];
}
