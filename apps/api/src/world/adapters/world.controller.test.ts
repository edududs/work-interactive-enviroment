import { describe, expect, it } from 'vitest';
import { Position } from '../domain/position.js';
import { objectEntity } from '../domain/world-entity.js';
import { WorldMap } from '../domain/world-map.js';
import { toMapStateDTO } from './world.controller.js';

describe('toMapStateDTO', () => {
  it('leaves agentId out of entities that are not agents', () => {
    const map = WorldMap.create({
      id: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: Position.of(0, 0),
      entities: [objectEntity({ id: 'plant', position: Position.of(32, 64), sprite: 'plant' })],
    });
    expect(toMapStateDTO(map).entities).toEqual([
      { id: 'plant', type: 'object', position: { x: 32, y: 64, mapId: 'office' }, sprite: 'plant' },
    ]);
  });
});
