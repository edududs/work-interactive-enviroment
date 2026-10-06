import { CHARACTER_RADIUS } from './character';

/** An object on the map, a plain crate until there are models. Same footprint as a character. */
export function Prop({ position }: { position: [number, number, number] }) {
  const size = CHARACTER_RADIUS * 2;
  return (
    <mesh position={[position[0], size / 2, position[2]]}>
      <boxGeometry args={[size, size, size]} />
      <meshLambertMaterial color="#a16207" />
    </mesh>
  );
}
