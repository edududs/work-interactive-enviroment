import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchGridMap, fetchMapState } from './world-gateway';

const respond = (body: unknown, status = 200) =>
  vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('world gateway', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps the contract DTO into the map state, keeping agentId only on agents', async () => {
    const fetchMock = respond({
      mapId: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: { x: 1, y: 2 },
      entities: [
        { id: 'npc', type: 'agent', position: { x: 3, y: 4, mapId: 'office' }, sprite: 'npc-dev', agentId: 'dev-ai' },
        { id: 'plant', type: 'object', position: { x: 5, y: 6, mapId: 'office' }, sprite: 'plant' },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    const state = await fetchMapState('office');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/world/maps/office');
    expect(state.entities).toEqual([
      { id: 'npc', sprite: 'npc-dev', x: 3, y: 4, agentId: 'dev-ai' },
      { id: 'plant', sprite: 'plant', x: 5, y: 6 },
    ]);
  });

  it('fails with the HTTP status when the API refuses', async () => {
    vi.stubGlobal('fetch', respond({ message: 'nope' }, 404));
    await expect(fetchMapState('nowhere')).rejects.toThrow('404');
  });

  it('loads the Tiled grid from the web app itself', async () => {
    const fetchMock = respond({ width: 1, height: 1, tilewidth: 32, layers: [], tilesets: [] });
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchGridMap('/maps/office.json')).toMatchObject({ width: 1, height: 1, tileSize: 32 });
    expect(fetchMock).toHaveBeenCalledWith('/maps/office.json');
  });
});
