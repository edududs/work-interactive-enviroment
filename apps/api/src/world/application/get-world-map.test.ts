import { describe, expect, it } from 'vitest';
import { InMemoryWorldMapRepository } from '../adapters/in-memory-world-map-repository.js';
import { Position } from '../domain/position.js';
import { WorldMap } from '../domain/world-map.js';
import { GetWorldMap, WorldMapNotFound } from './get-world-map.js';

const office = WorldMap.create({
  id: 'office',
  tilemapUrl: '/maps/office.json',
  spawn: Position.of(0, 0),
  entities: [],
});

describe('GetWorldMap', () => {
  it('returns the map', async () => {
    expect(await new GetWorldMap(new InMemoryWorldMapRepository([office])).execute('office')).toBe(office);
  });

  it('fails with WorldMapNotFound for an unknown id', async () => {
    await expect(new GetWorldMap(new InMemoryWorldMapRepository([])).execute('office')).rejects.toBeInstanceOf(
      WorldMapNotFound,
    );
  });
});
