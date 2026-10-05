import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { AgentDTO } from '@metaverso/contracts';
import { GetAgent, ListAgents } from '../application/agent-queries.js';
import type { Agent } from '../domain/agent.js';

const toAgentDTO = (agent: Agent): AgentDTO => ({ id: agent.id, name: agent.name, role: agent.role });

@Controller('agents')
export class AgentsController {
  constructor(
    @Inject(ListAgents) private readonly listAgents: ListAgents,
    @Inject(GetAgent) private readonly getAgent: GetAgent,
  ) {}

  @Get()
  async list(): Promise<AgentDTO[]> {
    return (await this.listAgents.execute()).map(toAgentDTO);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<AgentDTO> {
    return toAgentDTO(await this.getAgent.execute(id));
  }
}
