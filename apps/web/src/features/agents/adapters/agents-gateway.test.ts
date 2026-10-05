import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAgents } from './agents-gateway';

describe('agents gateway', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps the agents from the API', async () => {
    const body = [{ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' }];
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body))));
    expect(await fetchAgents()).toEqual(body);
  });
});
