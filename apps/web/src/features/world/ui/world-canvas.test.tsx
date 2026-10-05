import ReactThreeTestRenderer from '@react-three/test-renderer';
import userEvent from '@testing-library/user-event';
import type { Group, InstancedMesh } from 'three';
import { describe, expect, it, vi } from 'vitest';
import { gridFrom } from '../app/grid.fixture';
import type { WorldScene } from '../domain/scene';
import { Character } from './character';
import { MapMeshes } from './map-meshes';
import { Player } from './player';

// jsdom has no 2D canvas: labels get a stand-in context that measures every text as 100px.
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  measureText: () => ({ width: 100 }),
  beginPath: vi.fn(),
  roundRect: vi.fn(),
  fill: vi.fn(),
  fillText: vi.fn(),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

const corridor = gridFrom(['#######', '#.....#', '#######']);

describe('MapMeshes', () => {
  it('draws the floor and the blocks as two instanced meshes', async () => {
    const grid = {
      ...corridor,
      floor: [{ x: 0, z: 0, color: '#ffffff', height: 0, collides: false }],
      blocks: [
        { x: 1, z: 0, color: '#000000', height: 1, collides: true },
        { x: 2, z: 0, color: '#000000', height: 0, collides: false },
      ],
    };
    const renderer = await ReactThreeTestRenderer.create(<MapMeshes grid={grid} />);
    const meshes = renderer.scene.children.map((c) => c.instance as InstancedMesh);
    expect(meshes.map((m) => m.count)).toEqual([1, 1]); // flat blocks are not extruded
  });
});

describe('Character', () => {
  it('shows a label only when it has one', async () => {
    const named = await ReactThreeTestRenderer.create(
      <Character sprite="npc-dev" label="Dev AI" position={[1, 0, 2]} />,
    );
    const group = named.scene.children[0]!.instance as Group;
    expect(group.position.toArray()).toEqual([1, 0, 2]);
    expect(group.children.some((c) => c.type === 'Sprite')).toBe(true);

    const anonymous = await ReactThreeTestRenderer.create(<Character sprite="unknown" position={[0, 0, 0]} />);
    expect(anonymous.scene.children[0]!.children.some((c) => c.type === 'Sprite')).toBe(false);
  });
});

describe('Player', () => {
  const scene: WorldScene = {
    grid: corridor,
    spawn: { x: 1.5, z: 1.5 },
    entities: [{ id: 'npc-dev', sprite: 'npc-dev', x: 5.5, z: 1.5 }],
  };

  it('walks with the keyboard, stops at walls and reports the NPC it reaches', async () => {
    const user = userEvent.setup();
    const onNearbyChange = vi.fn();
    const renderer = await ReactThreeTestRenderer.create(
      <Player grid={scene.grid} spawn={scene.spawn} npcs={scene.entities} onNearbyChange={onNearbyChange} />,
    );
    const player = renderer.scene.children[0]!.instance as Group;

    await renderer.advanceFrames(1, 0.05);
    expect(onNearbyChange).not.toHaveBeenCalled(); // nothing changed yet: nobody is told

    await user.keyboard('{w>}');
    await renderer.advanceFrames(20, 0.05);
    await user.keyboard('{/w}');
    // It walks up until its body touches the wall (z = 1 + radius), then the wall holds it.
    expect(player.position.z).toBeCloseTo(1.3);

    await user.keyboard('{d>}');
    await renderer.advanceFrames(20, 0.05);
    await user.keyboard('{/d}');
    expect(player.position.x).toBeGreaterThan(3.4);
    expect(player.position.x).toBeLessThan(5.5 - 0.6 + 1e-6); // it never walks through the NPC
    expect(onNearbyChange).toHaveBeenLastCalledWith('npc-dev');

    await renderer.unmount();
  });
});
