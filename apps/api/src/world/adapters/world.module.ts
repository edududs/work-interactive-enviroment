import { Module } from '@nestjs/common';
import { GetWorldMap } from '../application/get-world-map.js';
import { InMemoryWorldMapRepository } from './in-memory-world-map-repository.js';
import { officeMap } from './seed.js';
import { WorldController } from './world.controller.js';

/** Composition of the world context: the only place that picks the repository adapter. */
@Module({
  controllers: [WorldController],
  providers: [
    {
      provide: GetWorldMap,
      useFactory: () => new GetWorldMap(new InMemoryWorldMapRepository([officeMap])),
    },
  ],
})
export class WorldModule {}
