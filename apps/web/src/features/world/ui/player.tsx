import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { type Group, Vector3 } from 'three';
import { type Circle, moveWithCollisions, stepFor } from '../app/movement';
import { findNearby } from '../app/proximity';
import { useDirectionInput } from '../app/use-direction-input';
import type { GridMap } from '../domain/grid-map';
import type { FloorPoint, SceneEntity } from '../domain/scene';
import { CHARACTER_RADIUS, Character } from './character';

// Fixed third-person camera, high and behind: low walls never hide the player.
const CAMERA_OFFSET = new Vector3(0, 11, 8.5);
const MAX_FRAME_SECONDS = 0.1; // no "teleport" after the tab was in the background

interface PlayerProps {
  grid: GridMap;
  spawn: FloorPoint;
  npcs: readonly SceneEntity[];
  onNearbyChange: (id: string | null) => void;
}

/**
 * Everything that changes every frame (position, camera) lives in refs and runs in useFrame.
 * React renders again only when the nearby NPC changes, through the callback.
 */
export function Player({ grid, spawn, npcs, onNearbyChange }: PlayerProps) {
  const ref = useRef<Group>(null);
  const body = useRef<Circle>({ x: spawn.x, z: spawn.z, r: CHARACTER_RADIUS });
  const input = useDirectionInput();
  const nearbyId = useRef<string | null>(null);
  const walkTime = useRef(0);
  const cameraPlaced = useRef(false);
  const onNearbyRef = useRef(onNearbyChange);
  const obstacles = useMemo(() => npcs.map((n): Circle => ({ x: n.x, z: n.z, r: CHARACTER_RADIUS })), [npcs]);
  const desired = useMemo(() => new Vector3(), []);
  const lookAt = useMemo(() => new Vector3(), []);

  useLayoutEffect(() => {
    onNearbyRef.current = onNearbyChange;
  }, [onNearbyChange]);

  useFrame(({ camera }, delta) => {
    const group = ref.current;
    if (!group || !input.current) return;
    const dt = Math.min(delta, MAX_FRAME_SECONDS);

    const direction = input.current.direction();
    const { dx, dz } = stepFor(direction, dt);
    if (dx !== 0 || dz !== 0) {
      moveWithCollisions(grid, body.current, dx, dz, obstacles);
      group.rotation.y = Math.atan2(direction.x, direction.z);
      walkTime.current += dt;
    } else {
      walkTime.current = 0;
    }
    group.position.set(body.current.x, Math.abs(Math.sin(walkTime.current * 12)) * 0.06, body.current.z);

    // The first frame places the camera at once; after that it follows smoothly.
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
