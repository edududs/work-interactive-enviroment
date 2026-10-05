export const INTERACTION_DISTANCE = 2; // tiles

/** Devolve o id da entidade mais próxima dentro do raio de interação, ou null. */
export function findNearby(
  from: { x: number; z: number },
  entities: { id: string; x: number; z: number }[],
): string | null {
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
