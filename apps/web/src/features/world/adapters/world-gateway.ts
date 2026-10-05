import type { MapStateDTO } from '@metaverso/contracts';
import { apiUrl, getJson } from '@/shared/adapters/http';
import type { GridMap } from '../domain/grid-map';
import type { MapState } from '../domain/scene';
import { parseTiledMap } from './tiled-map';

export function toMapState(dto: MapStateDTO): MapState {
  return {
    mapId: dto.mapId,
    tilemapUrl: dto.tilemapUrl,
    spawn: dto.spawn,
    entities: dto.entities.map((e) => ({
      id: e.id,
      sprite: e.sprite,
      x: e.position.x,
      y: e.position.y,
      ...(e.agentId === undefined ? {} : { agentId: e.agentId }),
    })),
  };
}

export async function fetchMapState(mapId: string): Promise<MapState> {
  return toMapState((await getJson(apiUrl(`/world/maps/${encodeURIComponent(mapId)}`))) as MapStateDTO);
}

/** The Tiled file is a static asset of the web app, not an API resource. */
export async function fetchGridMap(tilemapUrl: string): Promise<GridMap> {
  return parseTiledMap(await getJson(tilemapUrl));
}
