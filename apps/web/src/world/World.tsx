'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Character } from './components/Character';
import { MapMeshes } from './components/MapMeshes';
import { Player } from './components/Player';
import { loadTiledMap, type GridMap } from './map/tiledMap';
import type { WorldConfig } from './types';

export interface WorldProps {
  config: WorldConfig;
  /** Chamado só quando a entidade mais próxima muda (nunca a cada frame). */
  onNearbyEntityChanged?: (entityId: string | null) => void;
  onError?: (error: Error) => void;
}

/** Único ponto de entrada do mundo 3D. A UI (HUD, chat) fica fora daqui. */
export default function World({ config, onNearbyEntityChanged, onError }: WorldProps) {
  const [map, setMap] = useState<GridMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadTiledMap(config.tilemapUrl)
      .then((m) => !cancelled && setMap(m))
      .catch((err) => onError?.(err));
    return () => {
      cancelled = true;
    };
  }, [config.tilemapUrl, onError]);

  // Posições em pixels do Tiled -> unidades do mundo (1 tile = 1 unidade).
  const placed = useMemo(() => {
    if (!map) return null;
    const toWorld = (px: number) => px / map.tileSize;
    return {
      spawn: { x: toWorld(config.spawn.x), z: toWorld(config.spawn.y) },
      npcs: config.entities.map((e) => ({ ...e, x: toWorld(e.x), z: toWorld(e.y) })),
    };
  }, [map, config]);

  return (
    <Canvas
      // Limitar o pixel ratio é o que mais pesa em notebook com tela retina.
      dpr={[1, 1.5]}
      // Sem tone mapping: as cores do Tiled aparecem como foram definidas.
      flat
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ fov: 45, near: 0.1, far: 100 }}
    >
      <color attach="background" args={['#1f2937']} />
      <hemisphereLight args={['#ffffff', '#4b5563', 2]} />
      <directionalLight position={[-5, 10, 4]} intensity={1.5} />
      {map && placed && (
        <>
          <MapMeshes map={map} />
          {placed.npcs.map((n) => (
            <Character key={n.id} sprite={n.sprite} label={n.label} position={[n.x, 0, n.z]} />
          ))}
          <Player
            map={map}
            spawn={placed.spawn}
            npcs={placed.npcs}
            onNearbyChange={(id) => onNearbyEntityChanged?.(id)}
          />
        </>
      )}
    </Canvas>
  );
}
