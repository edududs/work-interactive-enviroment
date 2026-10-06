import type { GridMap } from '../domain/grid-map';
import type { MapState, WorldScene } from '../domain/scene';

/** API positions and the scene share the same unit, tiles. Labels come from whoever composes the page. */
export function buildWorldScene(
  state: MapState,
  grid: GridMap,
  labelFor: (agentId: string) => string | undefined,
): WorldScene {
  return {
    grid,
    spawn: { x: state.spawn.x, z: state.spawn.y },
    entities: state.entities.map((e) => {
      const label = e.type === 'agent' ? labelFor(e.agentId) : undefined;
      return { id: e.id, type: e.type, sprite: e.sprite, x: e.x, z: e.y, ...(label === undefined ? {} : { label }) };
    }),
  };
}
