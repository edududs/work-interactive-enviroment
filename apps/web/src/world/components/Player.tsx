import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GridMap } from '../map/tiledMap';
import { createKeyboardInput, type Input } from '../systems/input';
import { moveWithCollisions, PLAYER_SPEED, type Circle } from '../systems/movement';
import { findNearby } from '../systems/proximity';
import { Character, CHARACTER_RADIUS } from './Character';

// Câmera fixa em terceira pessoa, de cima e de trás: paredes baixas não escondem o jogador.
const CAMERA_OFFSET = new THREE.Vector3(0, 11, 8.5);

interface PlayerProps {
  map: GridMap;
  spawn: { x: number; z: number };
  npcs: { id: string; x: number; z: number }[];
  onNearbyChange: (id: string | null) => void;
}

/**
 * Tudo que muda a cada frame (posição, câmera) vive em refs e roda no useFrame.
 * O React só renderiza de novo quando a NPC próxima muda.
 */
export function Player({ map, spawn, npcs, onNearbyChange }: PlayerProps) {
  const ref = useRef<THREE.Group>(null);
  const body = useRef<Circle>({ x: spawn.x, z: spawn.z, r: CHARACTER_RADIUS });
  const input = useRef<Input | null>(null);
  const nearbyId = useRef<string | null>(null);
  const walkTime = useRef(0);
  const obstacles = useMemo(() => npcs.map((n): Circle => ({ x: n.x, z: n.z, r: CHARACTER_RADIUS })), [npcs]);
  const onNearbyRef = useRef(onNearbyChange);
  onNearbyRef.current = onNearbyChange;

  useEffect(() => {
    input.current = createKeyboardInput();
    return () => input.current?.dispose();
  }, []);

  const cameraPlaced = useRef(false);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.1); // evita "teleporte" depois de trocar de aba
    const group = ref.current;
    if (!group || !input.current) return;

    const dir = input.current.direction();
    const len = Math.hypot(dir.x, dir.z);
    if (len > 0) {
      const step = (PLAYER_SPEED * dt) / len;
      moveWithCollisions(map, body.current, dir.x * step, dir.z * step, obstacles);
      group.rotation.y = Math.atan2(dir.x, dir.z);
      walkTime.current += dt;
    } else {
      walkTime.current = 0;
    }
    group.position.set(body.current.x, Math.abs(Math.sin(walkTime.current * 12)) * 0.06, body.current.z);

    // Primeiro frame posiciona a câmera direto; depois ela segue suavizada.
    desired.set(body.current.x, 0, body.current.z).add(CAMERA_OFFSET);
    camera.position.lerp(desired, cameraPlaced.current ? 1 - Math.exp(-dt * 8) : 1);
    cameraPlaced.current = true;
    camera.lookAt(lookAt.copy(camera.position).sub(CAMERA_OFFSET));

    const id = findNearby(body.current, npcs);
    if (id !== nearbyId.current) {
      nearbyId.current = id;
      onNearbyRef.current(id);
    }
  });

  return <Character ref={ref} sprite="player" position={[spawn.x, 0, spawn.z]} />;
}
