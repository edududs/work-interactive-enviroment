import type { AgentRepository } from '../application/agent-repository.js';
import type { Agent } from '../domain/agent.js';

export class InMemoryAgentRepository implements AgentRepository {
  private readonly agents: readonly Agent[];

  constructor(agents: readonly Agent[]) {
    this.agents = [...agents];
  }

  list(): Promise<readonly Agent[]> {
    return Promise.resolve(this.agents);
  }

  findById(id: string): Promise<Agent | undefined> {
    return Promise.resolve(this.agents.find((a) => a.id === id));
  }
}
