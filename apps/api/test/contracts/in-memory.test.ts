import { describe, expect, it } from 'vitest';
import { InMemoryAgentRepository } from '../../src/agents/adapters/in-memory-agent-repository.js';
import { Agent } from '../../src/agents/domain/agent.js';
import { InMemoryWorldMapRepository } from '../../src/world/adapters/in-memory-world-map-repository.js';
import { Position } from '../../src/world/domain/position.js';
import { WorldMap } from '../../src/world/domain/world-map.js';
import { agentRepositoryContract } from './agent-repository.contract.js';
import { worldMapRepositoryContract } from './world-map-repository.contract.js';

agentRepositoryContract('in memory', (agents) => new InMemoryAgentRepository(agents));
worldMapRepositoryContract('in memory', (maps) => new InMemoryWorldMapRepository(maps));

// Seeds are written by hand: a repeated id is a typo that would hide a record, so it fails at startup.
describe('in-memory seeds', () => {
  it('reject a repeated agent id', () => {
    const dev = Agent.create({ id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' });
    expect(() => new InMemoryAgentRepository([dev, dev])).toThrow('duplicate agent id dev-ai');
  });

  it('reject a repeated map id', () => {
    const office = WorldMap.create({
      id: 'office',
      tilemapUrl: '/maps/office.json',
      spawn: Position.of(0, 0),
      entities: [],
    });
    expect(() => new InMemoryWorldMapRepository([office, office])).toThrow('duplicate map id office');
  });
});
