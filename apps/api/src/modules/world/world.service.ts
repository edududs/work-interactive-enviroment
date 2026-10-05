import { Injectable, NotFoundException } from '@nestjs/common';
import type { MapStateDTO } from '@metaverso/contracts';

// Estado estático em memória até a Fase 4 (Postgres).
const MAPS: Record<string, MapStateDTO> = {
  office: {
    mapId: 'office',
    tilemapUrl: '/maps/office.json',
    spawn: { x: 5 * 32 + 16, y: 13 * 32 + 16 },
    entities: [
      {
        id: 'npc-dev',
        type: 'agent',
        position: { x: 6 * 32 + 16, y: 4 * 32 + 16, mapId: 'office' },
        sprite: 'npc-dev',
        agentId: 'dev-ai',
      },
      {
        id: 'npc-research',
        type: 'agent',
        position: { x: 22 * 32 + 16, y: 4 * 32 + 16, mapId: 'office' },
        sprite: 'npc-research',
        agentId: 'research-ai',
      },
    ],
  },
};

@Injectable()
export class WorldService {
  getMap(mapId: string): MapStateDTO {
    const map = MAPS[mapId];
    if (!map) throw new NotFoundException(`Mapa ${mapId} não existe`);
    return map;
  }
}
