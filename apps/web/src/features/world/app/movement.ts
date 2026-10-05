import type { GridMap } from '../domain/grid-map';

export const PLAYER_SPEED = 4; // tiles per second

export interface Circle {
  x: number;
  z: number;
  readonly r: number;
}

function hitsSolidTile(map: GridMap, c: Circle): boolean {
  for (let z = Math.floor(c.z - c.r); z <= Math.floor(c.z + c.r); z++) {
    for (let x = Math.floor(c.x - c.r); x <= Math.floor(c.x + c.r); x++) {
      const outside = x < 0 || z < 0 || x >= map.width || z >= map.height;
      if (!outside && !map.solid[z * map.width + x]) continue;
      // Distance from the circle's center to the closest point of the tile.
      const nx = Math.max(x, Math.min(c.x, x + 1));
      const nz = Math.max(z, Math.min(c.z, z + 1));
      if ((c.x - nx) ** 2 + (c.z - nz) ** 2 < c.r * c.r) return true;
    }
  }
  return false;
}

const hitsObstacle = (c: Circle, obstacles: readonly Circle[]) =>
  obstacles.some((o) => (c.x - o.x) ** 2 + (c.z - o.z) ** 2 < (c.r + o.r) ** 2);

/**
 * Moves the circle one axis at a time, so it slides along walls instead of sticking to them.
 * Grid collision is enough for an office and needs no physics engine.
 */
export function moveWithCollisions(
  map: GridMap,
  body: Circle,
  dx: number,
  dz: number,
  obstacles: readonly Circle[],
): void {
  const blocked = (c: Circle) => hitsSolidTile(map, c) || hitsObstacle(c, obstacles);
  if (!blocked({ ...body, x: body.x + dx })) body.x += dx;
  if (!blocked({ ...body, z: body.z + dz })) body.z += dz;
}

/** Step for this frame: normalized so diagonals are not faster. */
export function stepFor(direction: { x: number; z: number }, dt: number): { dx: number; dz: number } {
  const len = Math.hypot(direction.x, direction.z);
  if (len === 0) return { dx: 0, dz: 0 };
  const scale = (PLAYER_SPEED * dt) / len;
  return { dx: direction.x * scale, dz: direction.z * scale };
}
