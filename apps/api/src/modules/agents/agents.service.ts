import { Injectable, NotFoundException } from '@nestjs/common';
import type { AgentDTO } from '@metaverso/contracts';

// O domínio de agentes não conhece posição nem sprite; o mundo só guarda o agentId.
const AGENTS: AgentDTO[] = [
  { id: 'dev-ai', name: 'Dev AI', role: 'Desenvolvimento' },
  { id: 'research-ai', name: 'Research AI', role: 'Pesquisa' },
];

@Injectable()
export class AgentsService {
  list(): AgentDTO[] {
    return AGENTS;
  }

  get(id: string): AgentDTO {
    const agent = AGENTS.find((a) => a.id === id);
    if (!agent) throw new NotFoundException(`Agente ${id} não existe`);
    return agent;
  }
}
