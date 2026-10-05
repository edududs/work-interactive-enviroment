import { Controller, Get, Param } from '@nestjs/common';
import type { AgentDTO } from '@metaverso/contracts';
import { AgentsService } from './agents.service.js';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @Get()
  list(): AgentDTO[] {
    return this.agents.list();
  }

  @Get(':id')
  get(@Param('id') id: string): AgentDTO {
    return this.agents.get(id);
  }
}
