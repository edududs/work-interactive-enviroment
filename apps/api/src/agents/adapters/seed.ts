import { Agent } from '../domain/agent.js';

/** The agents until they are configurable and persisted (phase 4). */
export const seedAgents: readonly Agent[] = [
  Agent.create({ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' }),
  Agent.create({ id: 'research-ai', name: 'Research AI', role: 'Pesquisa' }),
];
