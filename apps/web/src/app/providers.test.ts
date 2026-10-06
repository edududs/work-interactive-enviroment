import { describe, expect, it, vi } from 'vitest';
import * as errors from '@/shared/adapters/report-error';
import { createQueryClient } from './providers';

vi.mock('@/shared/adapters/report-error');

describe('createQueryClient', () => {
  it('reports every failed query with its key', async () => {
    const down = new Error('GET /api/agents falhou: 502');
    await expect(
      createQueryClient().query({ queryKey: ['agents'], queryFn: () => Promise.reject(down), retry: false }),
    ).rejects.toBe(down);
    expect(errors.reportError).toHaveBeenCalledWith(down, 'query ["agents"]');
  });
});
