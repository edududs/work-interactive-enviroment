import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { withQueryClient } from '../../../../test/query';
import * as gateway from '../adapters/agents-gateway';
import { useAgents } from './use-agents';

vi.mock('../adapters/agents-gateway');

describe('useAgents', () => {
  it('returns the agents', async () => {
    vi.mocked(gateway.fetchAgents).mockResolvedValue([{ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' }]);
    const { result } = renderHook(() => useAgents(), { wrapper: withQueryClient() });
    await waitFor(() => {
      expect(result.current.agents).toHaveLength(1);
    });
  });
});
