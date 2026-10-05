import type { Npc } from '../entities/Npc';
import type { Player } from '../entities/Player';

export const INTERACTION_DISTANCE = 64;

/** Devolve a NPC mais próxima dentro do raio de interação, ou null. */
export function findNearbyNpc(player: Player, npcs: Npc[]): Npc | null {
  let best: Npc | null = null;
  let bestDist = INTERACTION_DISTANCE;
  for (const npc of npcs) {
    const dist = Math.hypot(npc.x - player.x, npc.y - player.y);
    if (dist <= bestDist) {
      best = npc;
      bestDist = dist;
    }
  }
  return best;
}
