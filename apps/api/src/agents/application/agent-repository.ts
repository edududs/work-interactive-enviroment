import type { Agent } from '../domain/agent.js';

/** Port: where agents come from. In memory today, Postgres in phase 4. */
export interface AgentRepository {
  list(): Promise<readonly Agent[]>;
  findById(id: string): Promise<Agent | undefined>;
}
