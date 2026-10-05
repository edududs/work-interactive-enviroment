'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import type { AgentDTO, MapStateDTO } from '@metaverso/contracts';
import type { WorldConfig } from '@/world';
import { api } from '@/lib/api';

// O mundo 3D só roda no navegador.
const World = dynamic(() => import('@/world/World'), { ssr: false });

/** Junta o estado do mapa com os nomes dos agentes. É aqui, e não no mundo, que os dois domínios se encontram. */
function toWorldConfig(map: MapStateDTO, agents: AgentDTO[]): WorldConfig {
  const names = new Map(agents.map((a) => [a.id, a.name]));
  return {
    tilemapUrl: map.tilemapUrl,
    spawn: map.spawn,
    entities: map.entities.map((e) => ({
      id: e.id,
      sprite: e.sprite,
      x: e.position.x,
      y: e.position.y,
      label: e.agentId ? names.get(e.agentId) : undefined,
    })),
  };
}

export function WorldView({ mapId }: { mapId: string }) {
  const [config, setConfig] = useState<WorldConfig | null>(null);
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getMap(mapId), api.listAgents()])
      .then(([map, agents]) => !cancelled && setConfig(toWorldConfig(map, agents)))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
    return () => {
      cancelled = true;
    };
  }, [mapId]);

  const onError = useCallback((err: Error) => setError(err.message), []);
  const nearbyLabel = nearbyId ? (config?.entities.find((e) => e.id === nearbyId)?.label ?? nearbyId) : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {config && <World config={config} onNearbyEntityChanged={setNearbyId} onError={onError} />}
      <div style={hudStyle}>WASD ou setas para andar</div>
      {nearbyLabel && <div style={{ ...hudStyle, top: 'auto', bottom: 24 }}>Perto de {nearbyLabel}</div>}
      {error && <div style={{ ...hudStyle, background: '#991b1b' }}>Não consegui carregar o mundo: {error}</div>}
    </div>
  );
}

const hudStyle: CSSProperties = {
  position: 'absolute',
  top: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '6px 12px',
  borderRadius: 6,
  background: 'rgba(17,24,39,0.8)',
  fontSize: 14,
  pointerEvents: 'none',
  zIndex: 1,
};
