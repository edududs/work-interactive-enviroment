import type { AgentDTO, MapStateDTO } from '@metaverso/contracts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`GET ${path} falhou: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getMap: (mapId: string) => get<MapStateDTO>(`/world/maps/${mapId}`),
  listAgents: () => get<AgentDTO[]>('/agents'),
};
