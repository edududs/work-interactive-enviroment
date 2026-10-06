import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { MapStateDTO, WorldEntityDTO } from '@metaverso/contracts';
import { GetWorldMap } from '../application/get-world-map.js';
import type { WorldEntity } from '../domain/world-entity.js';
import type { WorldMap } from '../domain/world-map.js';

function toEntityDTO(entity: WorldEntity, mapId: string): WorldEntityDTO {
  const base = {
    id: entity.id,
    type: entity.kind,
    position: { x: entity.position.x, y: entity.position.y, mapId },
    sprite: entity.sprite,
  };
  return entity.kind === 'agent' ? { ...base, agentId: entity.agentId } : base;
}

export function toMapStateDTO(map: WorldMap): MapStateDTO {
  return {
    mapId: map.id,
    tilemapUrl: map.tilemapUrl,
    spawn: { x: map.spawn.x, y: map.spawn.y },
    entities: map.entities.map((e) => toEntityDTO(e, map.id)),
  };
}

@Controller('world')
export class WorldController {
  constructor(@Inject(GetWorldMap) private readonly getWorldMap: GetWorldMap) {}

  @Get('maps/:mapId')
  async getMap(@Param('mapId') mapId: string): Promise<MapStateDTO> {
    return toMapStateDTO(await this.getWorldMap.execute(mapId));
  }
}
