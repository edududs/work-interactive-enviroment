import { Canvas } from '@react-three/fiber';
import type { WorldScene } from '../domain/scene';
import { Character } from './character';
import { MapMeshes } from './map-meshes';
import { Player } from './player';

export interface WorldCanvasProps {
  scene: WorldScene;
  /** Called only when the closest entity changes, never every frame. */
  onNearbyChange: (entityId: string | null) => void;
}

/** The 3D world. It draws a scene and reports proximity; HUD and chat live outside it. */
export default function WorldCanvas({ scene, onNearbyChange }: WorldCanvasProps) {
  return (
    <Canvas
      // Capping the pixel ratio is what matters most on laptops with retina screens.
      dpr={[1, 1.5]}
      // No tone mapping: colors look exactly as the Tiled map defines them.
      flat
      gl={{ antialias: true, powerPreference: 'low-power' }}
      camera={{ fov: 45, near: 0.1, far: 100 }}
    >
      <color attach="background" args={['#1f2937']} />
      <hemisphereLight args={['#ffffff', '#4b5563', 2]} />
      <directionalLight position={[-5, 10, 4]} intensity={1.5} />
      <MapMeshes grid={scene.grid} />
      {scene.entities.map((e) => (
        <Character key={e.id} sprite={e.sprite} label={e.label} position={[e.x, 0, e.z]} />
      ))}
      <Player grid={scene.grid} spawn={scene.spawn} npcs={scene.entities} onNearbyChange={onNearbyChange} />
    </Canvas>
  );
}
