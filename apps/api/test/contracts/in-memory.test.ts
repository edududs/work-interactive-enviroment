import { InMemoryAgentRepository } from '../../src/agents/adapters/in-memory-agent-repository.js';
import { InMemoryWorldMapRepository } from '../../src/world/adapters/in-memory-world-map-repository.js';
import { agentRepositoryContract } from './agent-repository.contract.js';
import { worldMapRepositoryContract } from './world-map-repository.contract.js';

agentRepositoryContract('in memory', (agents) => new InMemoryAgentRepository(agents));
worldMapRepositoryContract('in memory', (maps) => new InMemoryWorldMapRepository(maps));
