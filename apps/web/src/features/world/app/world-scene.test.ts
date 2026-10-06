import { describe, expect, it } from 'vitest';
import type { MapState } from '../domain/scene';
import { gridFrom } from './grid.fixture';
import { buildWorldScene } from './world-scene';

describe('buildWorldScene', () => {
  const grid = gridFrom(['...']);
  const state: MapState = {
    mapId: 'office',
    tilemapUrl: '/maps/office.json',
    spawn: { x: 1.5, y: 0.5 },
    entities: [
      { id: 'npc-dev', type: 'agent', sprite: 'npc-dev', x: 2.5, y: 0.5, agentId: 'dev-ai' },
      { id: 'plant', type: 'object', sprite: 'plant', x: 0.5, y: 0.5 },
    ],
  };

  it('places everything on the floor plane and labels agents by their agent id', () => {
    const scene = buildWorldScene(state, grid, (id) => (id === 'dev-ai' ? 'Dev AI' : undefined));
    expect(scene.spawn).toEqual({ x: 1.5, z: 0.5 });
    expect(scene.entities).toEqual([
      { id: 'npc-dev', type: 'agent', sprite: 'npc-dev', x: 2.5, z: 0.5, label: 'Dev AI' },
      { id: 'plant', type: 'object', sprite: 'plant', x: 0.5, z: 0.5 },
    ]);
  });

  it('never asks a label for an object', () => {
    const asked: string[] = [];
    buildWorldScene(state, grid, (id) => {
      asked.push(id);
      return undefined;
    });
    expect(asked).toEqual(['dev-ai']);
  });

  it('leaves the label out while the agent name is unknown', () => {
    const scene = buildWorldScene(state, grid, () => undefined);
    expect(scene.entities[0]).not.toHaveProperty('label');
  });
});
