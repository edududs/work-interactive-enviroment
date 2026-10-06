import { describe, expect, it } from 'vitest';
import type { AgentRepository } from '../../src/agents/application/agent-repository.js';
import { Agent } from '../../src/agents/domain/agent.js';

/** Every AgentRepository adapter runs this suite; the Postgres one will join in phase 4. */
export function agentRepositoryContract(name: string, make: (agents: readonly Agent[]) => AgentRepository): void {
  describe(`AgentRepository contract: ${name}`, () => {
    const dev = Agent.create({ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' });
    const research = Agent.create({ id: 'research-ai', name: 'Research AI', role: 'Pesquisa' });

    it('lists what it holds, in order', async () => {
      expect(await make([dev, research]).list()).toEqual([dev, research]);
    });

    it('finds by id and answers undefined for an unknown id', async () => {
      const repo = make([dev]);
      expect(await repo.findById('dev-ai')).toEqual(dev);
      expect(await repo.findById('ghost')).toBeUndefined();
    });
  });
}
