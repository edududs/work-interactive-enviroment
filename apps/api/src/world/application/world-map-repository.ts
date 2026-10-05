import type { WorldMap } from '../domain/world-map.js';

/** Port: where maps come from. In memory today, Postgres in phase 4. */
export interface WorldMapRepository {
  findById(id: string): Promise<WorldMap | undefined>;
}
