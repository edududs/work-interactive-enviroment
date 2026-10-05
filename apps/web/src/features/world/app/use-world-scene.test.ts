import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { withQueryClient } from '../../../../test/query';
import * as gateway from '../adapters/world-gateway';
import { gridFrom } from './grid.fixture';
import { useWorldScene } from './use-world-scene';

vi.mock('../adapters/world-gateway');

describe('useWorldScene', () => {
  it('loads the map state, then its grid, and builds the scene', async () => {
    vi.mocked(gateway.fetchMapState).mockResolvedValue({
      mapId: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: { x: 16, y: 16 },
      entities: [{ id: 'npc', sprite: 'npc-dev', x: 48, y: 16, agentId: 'dev-ai' }],
    });
    vi.mocked(gateway.fetchGridMap).mockResolvedValue(gridFrom(['...']));

    const { result } = renderHook(() => useWorldScene('office', () => 'Dev AI'), { wrapper: withQueryClient() });

    await waitFor(() => {
      expect(result.current.scene).toBeDefined();
    });
    expect(gateway.fetchGridMap).toHaveBeenCalledWith('/maps/office.json');
    expect(result.current.scene?.entities[0]).toMatchObject({ x: 1.5, z: 0.5, label: 'Dev AI' });
    expect(result.current.error).toBeNull();
  });

  it('reports the error when the API fails', async () => {
    vi.mocked(gateway.fetchMapState).mockRejectedValue(new Error('GET falhou: 500'));
    const { result } = renderHook(() => useWorldScene('office', () => undefined), { wrapper: withQueryClient() });
    await waitFor(() => {
      expect(result.current.error?.message).toBe('GET falhou: 500');
    });
    expect(result.current.scene).toBeUndefined();
  });
});
