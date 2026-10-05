import type { FloorPoint } from '../domain/scene';

export const INTERACTION_DISTANCE = 2; // tiles

/** Id of the closest entity inside the interaction radius, or null. */
export function findNearby(from: FloorPoint, entities: readonly (FloorPoint & { id: string })[]): string | null {
  let best: string | null = null;
  let bestDist = INTERACTION_DISTANCE;
  for (const e of entities) {
    const dist = Math.hypot(e.x - from.x, e.z - from.z);
    if (dist <= bestDist) {
      best = e.id;
      bestDist = dist;
    }
  }
  return best;
}
