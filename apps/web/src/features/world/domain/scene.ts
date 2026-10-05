import type { GridMap } from './grid-map';

/** Where a map lives and what stands on it, in map pixels, as the API describes it. */
export interface MapState {
  readonly mapId: string;
  readonly tilemapUrl: string;
  readonly spawn: { readonly x: number; readonly y: number };
  readonly entities: readonly MapEntity[];
}

export interface MapEntity {
  readonly id: string;
  readonly sprite: string;
  readonly x: number;
  readonly y: number;
  /** Set only on agents: the world never looks behind it, it only asks the page for a label. */
  readonly agentId?: string;
}

/** A point on the floor plane, in tiles. */
export interface FloorPoint {
  readonly x: number;
  readonly z: number;
}

export interface SceneEntity extends FloorPoint {
  readonly id: string;
  readonly sprite: string;
  readonly label?: string;
}

/** Everything the 3D world needs to draw a map, already in tiles. */
export interface WorldScene {
  readonly grid: GridMap;
  readonly spawn: FloorPoint;
  readonly entities: readonly SceneEntity[];
}
