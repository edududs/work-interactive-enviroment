import type { Ref } from 'react';
import type { Group } from 'three';
import { Label } from './label';

// Low-poly characters made of primitives until there are glTF models.
const CHARACTER_COLORS: Readonly<Record<string, string>> = {
  player: '#3b82f6',
  'npc-dev': '#22c55e',
  'npc-research': '#a855f7',
};

export const CHARACTER_RADIUS = 0.3;

interface CharacterProps {
  sprite: string;
  label?: string | undefined;
  position: [number, number, number];
  ref?: Ref<Group> | undefined;
}

export function Character({ sprite, label, position, ref }: CharacterProps) {
  const color = CHARACTER_COLORS[sprite] ?? '#9ca3af';
  return (
    <group {...(ref ? { ref } : {})} position={position}>
      <mesh position-y={0.55}>
        <capsuleGeometry args={[CHARACTER_RADIUS, 0.45, 4, 10]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* A visor on the front shows where the character faces (+z is forward). */}
      <mesh position={[0, 0.78, CHARACTER_RADIUS - 0.02]}>
        <boxGeometry args={[0.34, 0.12, 0.08]} />
        <meshLambertMaterial color="#111827" />
      </mesh>
      {/* Fake shadow: a dark disc costs far less than shadow maps. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <circleGeometry args={[CHARACTER_RADIUS * 1.1, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {label && <Label text={label} y={1.35} />}
    </group>
  );
}
