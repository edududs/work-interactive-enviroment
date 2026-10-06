import { describe, expect, it, vi } from 'vitest';
import { reportError } from './report-error';

describe('reportError', () => {
  it('writes the failure and where it happened to the console', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const failure = new Error('boom');
    reportError(failure, 'query ["agents"]');
    expect(consoleError).toHaveBeenCalledWith('[query ["agents"]]', failure);
    consoleError.mockRestore();
  });
});
