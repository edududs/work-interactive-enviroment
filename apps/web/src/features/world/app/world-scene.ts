import type { GridMap } from '../domain/grid-map';
import type { MapState, WorldScene } from '../domain/scene';

/** API positions are map pixels; the scene is in tiles. Labels come from whoever composes the page. */
export function buildWorldScene(
  state: MapState,
  grid: GridMap,
  labelFor: (agentId: string) => string | undefined,
): WorldScene {
  const toTiles = (px: number) => px / grid.tileSize;
  return {
    grid,
    spawn: { x: toTiles(state.spawn.x), z: toTiles(state.spawn.y) },
    entities: state.entities.map((e) => {
      const label = e.agentId === undefined ? undefined : labelFor(e.agentId);
      return {
        id: e.id,
        sprite: e.sprite,
        x: toTiles(e.x),
        z: toTiles(e.y),
        ...(label === undefined ? {} : { label }),
      };
    }),
  };
}
