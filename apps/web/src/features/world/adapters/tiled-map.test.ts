import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseTiledMap } from './tiled-map';

const tiled = (walls: number[]) => ({
  width: 2,
  height: 2,
  tilewidth: 32,
  layers: [
    { name: 'ground', type: 'tilelayer', data: [1, 1, 1, 1] },
    { name: 'walls', type: 'tilelayer', data: walls },
  ],
  tilesets: [
    {
      firstgid: 1,
      tiles: [
        { id: 0, properties: [{ name: 'color', value: '#ffd6ccba' }] },
        {
          id: 1,
          properties: [
            { name: 'collides', value: true },
            { name: 'height', value: 1.1 },
            { name: 'color', value: '#464a5c' },
          ],
        },
      ],
    },
  ],
});

describe('parseTiledMap', () => {
  it('reads floor, blocks and solid tiles from the tileset properties', () => {
    const grid = parseTiledMap(tiled([0, 2, 0, 0]));
    expect(grid).toMatchObject({ width: 2, height: 2, tileSize: 32 });
    expect(grid.floor).toHaveLength(4);
    expect(grid.floor[0]).toEqual({ x: 0, z: 0, color: '#d6ccba', height: 0, collides: false });
    expect(grid.blocks).toEqual([{ x: 1, z: 0, color: '#464a5c', height: 1.1, collides: true }]);
    expect(grid.solid).toEqual([false, true, false, false]);
  });

  it('refuses something that is not a Tiled map', () => {
    expect(() => parseTiledMap({ hello: 'world' })).toThrow(/Tiled/);
    expect(() => parseTiledMap(null)).toThrow(/Tiled/);
  });

  it('reads the office map shipped with the app', () => {
    const office: unknown = JSON.parse(readFileSync(resolve(process.cwd(), 'public/maps/office.json'), 'utf8'));
    const grid = parseTiledMap(office);
    expect(grid.width * grid.height).toBe(grid.solid.length);
    // Spawn tile (5, 13) and the doors (6..7, 8) must be walkable.
    expect(grid.solid[13 * grid.width + 5]).toBe(false);
    expect(grid.solid[8 * grid.width + 6]).toBe(false);
    expect(grid.solid[8 * grid.width + 7]).toBe(false);
  });
});
