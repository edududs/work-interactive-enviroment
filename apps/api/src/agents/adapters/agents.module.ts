import { Module } from '@nestjs/common';
import type { AgentRepository } from '../application/agent-repository.js';
import { GetAgent, ListAgents } from '../application/agent-queries.js';
import { AgentsController } from './agents.controller.js';
import { InMemoryAgentRepository } from './in-memory-agent-repository.js';
import { seedAgents } from './seed.js';

const AGENT_REPOSITORY = Symbol('AgentRepository');

/** Composition of the agents context: the only place that picks the repository adapter. */
@Module({
  controllers: [AgentsController],
  providers: [
    { provide: AGENT_REPOSITORY, useFactory: () => new InMemoryAgentRepository(seedAgents) },
    { provide: ListAgents, inject: [AGENT_REPOSITORY], useFactory: (repo: AgentRepository) => new ListAgents(repo) },
    { provide: GetAgent, inject: [AGENT_REPOSITORY], useFactory: (repo: AgentRepository) => new GetAgent(repo) },
  ],
})
export class AgentsModule {}
