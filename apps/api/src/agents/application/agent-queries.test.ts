import { describe, expect, it } from 'vitest';
import { InMemoryAgentRepository } from '../adapters/in-memory-agent-repository.js';
import { Agent } from '../domain/agent.js';
import { AgentNotFound, GetAgent, ListAgents } from './agent-queries.js';

const dev = Agent.create({ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' });
const repo = new InMemoryAgentRepository([dev]);

describe('agent queries', () => {
  it('lists the agents', async () => {
    expect(await new ListAgents(repo).execute()).toEqual([dev]);
  });

  it('gets an agent by id', async () => {
    expect(await new GetAgent(repo).execute('dev-ai')).toBe(dev);
  });

  it('fails with AgentNotFound for an unknown id', async () => {
    await expect(new GetAgent(repo).execute('ghost')).rejects.toBeInstanceOf(AgentNotFound);
  });
});
