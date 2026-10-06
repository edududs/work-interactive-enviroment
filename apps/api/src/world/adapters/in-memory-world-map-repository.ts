import type { WorldMapRepository } from '../application/world-map-repository.js';
import type { WorldMap } from '../domain/world-map.js';

export class InMemoryWorldMapRepository implements WorldMapRepository {
  private readonly maps = new Map<string, WorldMap>();

  constructor(maps: readonly WorldMap[]) {
    for (const map of maps) {
      if (this.maps.has(map.id)) throw new Error(`duplicate map id ${map.id}`);
      this.maps.set(map.id, map);
    }
  }

  findById(id: string): Promise<WorldMap | undefined> {
    return Promise.resolve(this.maps.get(id));
  }
}
