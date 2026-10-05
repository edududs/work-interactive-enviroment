import { describe, expect, it } from 'vitest';
import { gridFrom } from './grid.fixture';
import { buildWorldScene } from './world-scene';

describe('buildWorldScene', () => {
  const grid = gridFrom(['...']);
  const state = {
    mapId: 'office',
    tilemapUrl: '/maps/office.json',
    spawn: { x: 48, y: 16 },
    entities: [
      { id: 'npc-dev', sprite: 'npc-dev', x: 80, y: 16, agentId: 'dev-ai' },
      { id: 'plant', sprite: 'plant', x: 16, y: 16 },
    ],
  };

  it('converts map pixels into tiles and asks for labels by agent id', () => {
    const scene = buildWorldScene(state, grid, (id) => (id === 'dev-ai' ? 'Dev AI' : undefined));
    expect(scene.spawn).toEqual({ x: 1.5, z: 0.5 });
    expect(scene.entities).toEqual([
      { id: 'npc-dev', sprite: 'npc-dev', x: 2.5, z: 0.5, label: 'Dev AI' },
      { id: 'plant', sprite: 'plant', x: 0.5, z: 0.5 },
    ]);
  });

  it('leaves the label out while the agent name is unknown', () => {
    const scene = buildWorldScene(state, grid, () => undefined);
    expect(scene.entities[0]).not.toHaveProperty('label');
  });
});
