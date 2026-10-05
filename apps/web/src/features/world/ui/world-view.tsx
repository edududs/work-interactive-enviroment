'use client';

import dynamic from 'next/dynamic';
import { type ComponentType, useState } from 'react';
import type { WorldScene } from '../domain/scene';
import type { WorldCanvasProps } from './world-canvas';

// WebGL only exists in the browser.
const WorldCanvas: ComponentType<WorldCanvasProps> = dynamic(() => import('./world-canvas'), { ssr: false });

const hud = 'pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-md px-3 py-1.5 text-sm';

export interface WorldViewProps {
  scene: WorldScene | undefined;
  error: Error | null;
}

/** The world plus its HUD. React draws the HUD; the canvas draws the world. */
export function WorldView({ scene, error }: WorldViewProps) {
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const nearby = scene?.entities.find((e) => e.id === nearbyId);

  return (
    <div className="relative h-full w-full">
      {scene && <WorldCanvas scene={scene} onNearbyChange={setNearbyId} />}
      <p className={`${hud} top-4 bg-gray-900/80`}>WASD ou setas para andar</p>
      {nearby && (
        <p role="status" className={`${hud} bottom-6 bg-gray-900/80`}>
          Perto de {nearby.label ?? nearby.id}
        </p>
      )}
      {error && (
        <p role="alert" className={`${hud} top-16 bg-red-800`}>
          Não consegui carregar o mundo: {error.message}
        </p>
      )}
    </div>
  );
}
