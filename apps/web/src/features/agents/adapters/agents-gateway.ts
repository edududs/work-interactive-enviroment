import type { AgentDTO } from '@metaverso/contracts';
import { apiUrl, getJson } from '@/shared/adapters/http';
import type { Agent } from '../domain/agent';

const toAgent = (dto: AgentDTO): Agent => ({ id: dto.id, name: dto.name, role: dto.role });

export async function fetchAgents(): Promise<Agent[]> {
  return ((await getJson(apiUrl('/agents'))) as AgentDTO[]).map(toAgent);
}
