import { Controller, Get, Param } from '@nestjs/common';
import type { MapStateDTO } from '@metaverso/contracts';
import { WorldService } from './world.service.js';

@Controller('world')
export class WorldController {
  constructor(private readonly world: WorldService) {}

  @Get('maps/:mapId')
  getMap(@Param('mapId') mapId: string): MapStateDTO {
    return this.world.getMap(mapId);
  }
}
