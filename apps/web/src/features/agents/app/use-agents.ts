import { useQuery } from '@tanstack/react-query';
import { fetchAgents } from '../adapters/agents-gateway';
import type { Agent } from '../domain/agent';

export const agentKeys = { all: ['agents'] as const };

export function useAgents(): { agents: readonly Agent[] | undefined; error: Error | null } {
  const query = useQuery({ queryKey: agentKeys.all, queryFn: fetchAgents });
  return { agents: query.data, error: query.error };
}
