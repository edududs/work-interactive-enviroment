'use client';

import { useAgents } from '@/features/agents/app/use-agents';
import { useWorldScene } from '@/features/world/app/use-world-scene';
import { WorldView } from '@/features/world/ui/world-view';

/**
 * The only place where the world and the agents meet: the world asks for a label by agent id
 * and never learns what an agent is.
 */
export function OfficePage() {
  const { agents, error: agentsError } = useAgents();
  const names = new Map(agents?.map((a) => [a.id, a.name]));
  const labelFor = (agentId: string) => names.get(agentId);
  const { scene, error } = useWorldScene('office', labelFor);

  return (
    <main className="h-dvh">
      <WorldView scene={scene} error={error ?? agentsError} />
    </main>
  );
}
