import type { Ref } from 'react';
import type * as THREE from 'three';
import { Label } from './Label';

// Personagens low-poly feitos de primitivas até termos modelos glTF.
const CHARACTER_COLORS: Record<string, string> = {
  player: '#3b82f6',
  'npc-dev': '#22c55e',
  'npc-research': '#a855f7',
};

export const CHARACTER_RADIUS = 0.3;

interface CharacterProps {
  sprite: string;
  label?: string;
  position?: [number, number, number];
  ref?: Ref<THREE.Group>;
}

export function Character({ sprite, label, position, ref }: CharacterProps) {
  const color = CHARACTER_COLORS[sprite] ?? '#9ca3af';
  return (
    <group ref={ref} position={position}>
      <mesh position-y={0.55}>
        <capsuleGeometry args={[CHARACTER_RADIUS, 0.45, 4, 10]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* "Visor" na frente para dar direção ao personagem (+z é a frente). */}
      <mesh position={[0, 0.78, CHARACTER_RADIUS - 0.02]}>
        <boxGeometry args={[0.34, 0.12, 0.08]} />
        <meshLambertMaterial color="#111827" />
      </mesh>
      {/* Sombra falsa: um disco escuro é bem mais barato que shadow maps. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <circleGeometry args={[CHARACTER_RADIUS * 1.1, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {label && <Label text={label} y={1.35} />}
    </group>
  );
}
