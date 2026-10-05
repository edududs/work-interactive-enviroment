import { NotFoundError } from '../../shared/application/errors.js';
import type { WorldMap } from '../domain/world-map.js';
import type { WorldMapRepository } from './world-map-repository.js';

export class WorldMapNotFound extends NotFoundError {
  constructor(id: string) {
    super(`map ${id} does not exist`);
  }
}

export class GetWorldMap {
  constructor(private readonly maps: WorldMapRepository) {}

  async execute(id: string): Promise<WorldMap> {
    const map = await this.maps.findById(id);
    if (!map) throw new WorldMapNotFound(id);
    return map;
  }
}
