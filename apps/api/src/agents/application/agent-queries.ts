import { NotFoundError } from '../../shared/application/errors.js';
import type { Agent } from '../domain/agent.js';
import type { AgentRepository } from './agent-repository.js';

export class AgentNotFound extends NotFoundError {
  constructor(id: string) {
    super(`agent ${id} does not exist`);
  }
}

export class ListAgents {
  constructor(private readonly agents: AgentRepository) {}

  execute(): Promise<readonly Agent[]> {
    return this.agents.list();
  }
}

export class GetAgent {
  constructor(private readonly agents: AgentRepository) {}

  async execute(id: string): Promise<Agent> {
    const agent = await this.agents.findById(id);
    if (!agent) throw new AgentNotFound(id);
    return agent;
  }
}
