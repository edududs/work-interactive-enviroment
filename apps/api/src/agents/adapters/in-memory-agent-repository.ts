import type { AgentRepository } from '../application/agent-repository.js';
import type { Agent } from '../domain/agent.js';

export class InMemoryAgentRepository implements AgentRepository {
  private readonly agents = new Map<string, Agent>();

  constructor(agents: readonly Agent[]) {
    for (const agent of agents) {
      if (this.agents.has(agent.id)) throw new Error(`duplicate agent id ${agent.id}`);
      this.agents.set(agent.id, agent);
    }
  }

  list(): Promise<readonly Agent[]> {
    return Promise.resolve([...this.agents.values()]);
  }

  findById(id: string): Promise<Agent | undefined> {
    return Promise.resolve(this.agents.get(id));
  }
}
