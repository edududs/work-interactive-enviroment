import type { MapStateDTO, WorldEntityDTO } from '@metaverso/contracts';
import { apiUrl, getJson } from '@/shared/adapters/http';
import type { GridMap } from '../domain/grid-map';
import type { MapEntity, MapState } from '../domain/scene';
import { parseTiledMap } from './tiled-map';

function toMapEntity(dto: WorldEntityDTO): MapEntity | undefined {
  const base = { id: dto.id, sprite: dto.sprite, x: dto.position.x, y: dto.position.y };
  switch (dto.type) {
    case 'agent':
      if (dto.agentId === undefined) throw new Error(`agente ${dto.id} sem agentId`);
      return { ...base, type: 'agent', agentId: dto.agentId };
    case 'object':
      return { ...base, type: 'object' };
    case 'player':
      return undefined; // players are people online, not part of the map
  }
}

export function toMapState(dto: MapStateDTO): MapState {
  return {
    mapId: dto.mapId,
    tilemapUrl: dto.tilemapUrl,
    spawn: dto.spawn,
    entities: dto.entities.map(toMapEntity).filter((e) => e !== undefined),
  };
}

export async function fetchMapState(mapId: string): Promise<MapState> {
  return toMapState((await getJson(apiUrl(`/world/maps/${encodeURIComponent(mapId)}`))) as MapStateDTO);
}

/** The Tiled file is a static asset of the web app, not an API resource. */
export async function fetchGridMap(tilemapUrl: string): Promise<GridMap> {
  return parseTiledMap(await getJson(tilemapUrl));
}
