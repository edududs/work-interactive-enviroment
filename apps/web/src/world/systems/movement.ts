import type { GridMap } from '../map/tiledMap';

export const PLAYER_SPEED = 4; // tiles por segundo

export interface Circle {
  x: number;
  z: number;
  r: number;
}

function hitsSolidTile(map: GridMap, c: Circle): boolean {
  const minX = Math.floor(c.x - c.r);
  const maxX = Math.floor(c.x + c.r);
  const minZ = Math.floor(c.z - c.r);
  const maxZ = Math.floor(c.z + c.r);
  for (let z = minZ; z <= maxZ; z++) {
    for (let x = minX; x <= maxX; x++) {
      const outside = x < 0 || z < 0 || x >= map.width || z >= map.height;
      if (!outside && !map.solid[z * map.width + x]) continue;
      // Distância do centro do círculo ao ponto mais próximo do tile.
      const nx = Math.max(x, Math.min(c.x, x + 1));
      const nz = Math.max(z, Math.min(c.z, z + 1));
      if ((c.x - nx) ** 2 + (c.z - nz) ** 2 < c.r * c.r) return true;
    }
  }
  return false;
}

function hitsObstacle(c: Circle, obstacles: Circle[]): boolean {
  return obstacles.some((o) => (c.x - o.x) ** 2 + (c.z - o.z) ** 2 < (c.r + o.r) ** 2);
}

/**
 * Move o círculo eixo a eixo para que ele deslize ao longo de paredes em vez de travar.
 * Colisão simples em grid: suficiente para um escritório e sem motor de física.
 */
export function moveWithCollisions(map: GridMap, body: Circle, dx: number, dz: number, obstacles: Circle[]) {
  const blocked = (c: Circle) => hitsSolidTile(map, c) || hitsObstacle(c, obstacles);
  const nextX = { ...body, x: body.x + dx };
  if (!blocked(nextX)) body.x = nextX.x;
  const nextZ = { ...body, z: body.z + dz };
  if (!blocked(nextZ)) body.z = nextZ.z;
}
