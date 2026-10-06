import { describe, expect, it } from 'vitest';
import type { WorldMapRepository } from '../../src/world/application/world-map-repository.js';
import { Position } from '../../src/world/domain/position.js';
import { WorldMap } from '../../src/world/domain/world-map.js';

/** Every WorldMapRepository adapter runs this suite; the Postgres one will join in phase 4. */
export function worldMapRepositoryContract(
  name: string,
  make: (maps: readonly WorldMap[]) => WorldMapRepository,
): void {
  describe(`WorldMapRepository contract: ${name}`, () => {
    const office = WorldMap.create({
      id: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: Position.of(1, 1),
      entities: [],
    });

    it('finds a map by id and answers undefined for an unknown id', async () => {
      const repo = make([office]);
      expect(await repo.findById('office')).toEqual(office);
      expect(await repo.findById('nowhere')).toBeUndefined();
    });
  });
}
