import { describe, expect, it } from 'vitest';
import { InvariantError } from '../../shared/domain/invariant.js';
import { Agent } from './agent.js';

describe('Agent', () => {
  it('keeps id, name and role', () => {
    expect(Agent.create({ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' })).toMatchObject({
      id: 'dev-ai',
      name: 'Dev AI',
      role: 'Desenvolvimento',
    });
  });

  it.each(['id', 'name', 'role'] as const)('refuses an empty %s', (field) => {
    const props = { id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento', [field]: '' };
    expect(() => Agent.create(props)).toThrow(InvariantError);
  });
});
