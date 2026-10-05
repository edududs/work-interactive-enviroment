import type { WorldMapRepository } from '../application/world-map-repository.js';
import type { WorldMap } from '../domain/world-map.js';

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private readonly maps: Map<string, WorldMap>;

  constructor(maps: readonly WorldMap[]) {
    this.maps = new Map(maps.map((m) => [m.id, m]));
  }

  findById(id: string): Promise<WorldMap | undefined> {
    return Promise.resolve(this.maps.get(id));
  }
}
