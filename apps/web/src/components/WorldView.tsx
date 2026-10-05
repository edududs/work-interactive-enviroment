'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { AgentDTO, MapStateDTO } from '@metaverso/contracts';
import type { WorldConfig } from '@/world';
import { api } from '@/lib/api';

/** Junta o estado do mapa com os nomes dos agentes. É aqui, e não no mundo, que os dois domínios se encontram. */
function toWorldConfig(map: MapStateDTO, agents: AgentDTO[]): WorldConfig {
  const names = new Map(agents.map((a) => [a.id, a.name]));
  return {
    tilemapUrl: map.tilemapUrl,
    tilesetUrl: map.tilesetUrl,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let destroyed = false;
    let destroy: (() => void) | undefined;

    (async () => {
      try {
        const [map, agents, { createWorld }] = await Promise.all([
          api.getMap(mapId),
          api.listAgents(),
          import('@/world'), // Phaser só roda no navegador
        ]);
        if (destroyed || !containerRef.current) return;
        const config = toWorldConfig(map, agents);
        const world = createWorld(containerRef.current, config);
        world.on('nearbyEntityChanged', (id) => {
          setNearbyLabel(id ? (config.entities.find((e) => e.id === id)?.label ?? id) : null);
        });
        destroy = () => world.destroy();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    })();

    return () => {
      destroyed = true;
      destroy?.();
    };
  }, [mapId]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
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
};
