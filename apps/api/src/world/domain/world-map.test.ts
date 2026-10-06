import { describe, expect, it } from 'vitest';
import { InvariantError } from '../../shared/domain/invariant.js';
import { Position } from './position.js';
import { agentEntity, objectEntity } from './world-entity.js';
import { WorldMap } from './world-map.js';

const origin = Position.of(0, 0);

describe('WorldMap', () => {
  it('keeps its entities and trims identifiers', () => {
    const map = WorldMap.create({
      id: ' office ',
      tilemapUrl: '/maps/office.json',
      spawn: origin,
      entities: [
        agentEntity({ id: 'npc', position: origin, sprite: 'npc-dev', agentId: 'dev-ai' }),
        objectEntity({ id: 'plant', position: origin, sprite: 'plant' }),
      ],
    });
    expect(map.id).toBe('office');
    expect(map.entities.map((e) => e.kind)).toEqual(['agent', 'object']);
  });

  it('refuses two entities with the same id', () => {
    const twin = agentEntity({ id: 'npc', position: origin, sprite: 'npc-dev', agentId: 'dev-ai' });
    expect(() =>
      WorldMap.create({ id: 'office', tilemapUrl: '/maps/office.json', spawn: origin, entities: [twin, twin] }),
    ).toThrow(InvariantError);
  });

  it('refuses an empty id or tilemap', () => {
    expect(() => WorldMap.create({ id: ' ', tilemapUrl: '/m.json', spawn: origin, entities: [] })).toThrow(
      InvariantError,
    );
    expect(() => WorldMap.create({ id: 'office', tilemapUrl: '', spawn: origin, entities: [] })).toThrow(
      InvariantError,
    );
  });

  it('refuses an agent entity without an agent id', () => {
    expect(() => agentEntity({ id: 'npc', position: origin, sprite: 'npc-dev', agentId: '  ' })).toThrow(
      InvariantError,
    );
  });
});
