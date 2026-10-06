import type { GridMap } from './grid-map';

/** Where a map lives and what stands on it, in tiles, as the API describes it. */
export interface MapState {
  readonly mapId: string;
  readonly tilemapUrl: string;
  readonly spawn: { readonly x: number; readonly y: number };
  readonly entities: readonly MapEntity[];
}

interface MapEntityBase {
  readonly id: string;
  readonly sprite: string;
  readonly x: number;
  readonly y: number;
}

/** An agent carries the id the world never looks behind; it only asks the page for a label. */
export type MapEntity =
  | (MapEntityBase & { readonly type: 'agent'; readonly agentId: string })
  | (MapEntityBase & { readonly type: 'object' });

/** A point on the floor plane, in tiles. */
export interface FloorPoint {
  readonly x: number;
  readonly z: number;
}

export interface SceneEntity extends FloorPoint {
  readonly id: string;
  /** Agents are characters you can walk up to; objects only block the way. */
  readonly type: 'agent' | 'object';
  readonly sprite: string;
  readonly label?: string;
}

/** Everything the 3D world needs to draw a map. */
export interface WorldScene {
  readonly grid: GridMap;
  readonly spawn: FloorPoint;
  readonly entities: readonly SceneEntity[];
}
