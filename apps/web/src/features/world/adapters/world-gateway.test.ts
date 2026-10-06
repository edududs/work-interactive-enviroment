import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchGridMap, fetchMapState } from './world-gateway';

const respond = (body: unknown, status = 200) =>
  vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('world gateway', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the API through the web origin and keeps each entity type', async () => {
    const fetchMock = respond({
      mapId: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: { x: 1, y: 2 },
      entities: [
        { id: 'npc', type: 'agent', position: { x: 3, y: 4, mapId: 'office' }, sprite: 'npc-dev', agentId: 'dev-ai' },
        { id: 'plant', type: 'object', position: { x: 5, y: 6, mapId: 'office' }, sprite: 'plant' },
        { id: 'someone', type: 'player', position: { x: 7, y: 8, mapId: 'office' }, sprite: 'player' },
      ],
    });
    vi.stubGlobal('fetch', fetchMock);

    const state = await fetchMapState('office');

    expect(fetchMock).toHaveBeenCalledWith('/api/world/maps/office');
    expect(state.entities).toEqual([
      { id: 'npc', type: 'agent', sprite: 'npc-dev', x: 3, y: 4, agentId: 'dev-ai' },
      { id: 'plant', type: 'object', sprite: 'plant', x: 5, y: 6 },
    ]); // players are people online, not map content
  });

  it('refuses an agent the API sent without its agentId', async () => {
    vi.stubGlobal(
      'fetch',
      respond({
        mapId: 'office',
        tilemapUrl: '/maps/office.json',
        spawn: { x: 1, y: 2 },
        entities: [{ id: 'npc', type: 'agent', position: { x: 3, y: 4, mapId: 'office' }, sprite: 'npc-dev' }],
      }),
    );
    await expect(fetchMapState('office')).rejects.toThrow('npc');
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
