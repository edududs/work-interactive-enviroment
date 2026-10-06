import { useLayoutEffect, useRef } from 'react';
import { Color, type InstancedMesh, Matrix4 } from 'three';
import type { Block, GridMap } from '../domain/grid-map';

const FLOOR_THICKNESS = 0.1;

/**
 * One instanced mesh per layer: the whole map costs 2 draw calls.
 * Matrices are written once; there is no React component per tile.
 */
function BlockLayer({
  blocks,
  heightOf,
  baseY,
}: {
  blocks: readonly Block[];
  heightOf: (b: Block) => number;
  baseY: number;
}) {
  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new Matrix4();
    const color = new Color();
    blocks.forEach((b, i) => {
      const h = heightOf(b);
      matrix.makeScale(1, h, 1).setPosition(b.x + 0.5, baseY + h / 2, b.z + 0.5);
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, color.set(b.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blocks, heightOf, baseY]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]}>
      <boxGeometry />
      <meshLambertMaterial />
    </instancedMesh>
  );
}

const floorHeight = () => FLOOR_THICKNESS;
const blockHeight = (b: Block) => b.height;

export function MapMeshes({ grid }: { grid: GridMap }) {
  return (
    <>
      <BlockLayer blocks={grid.floor} heightOf={floorHeight} baseY={-FLOOR_THICKNESS} />
      <BlockLayer blocks={grid.blocks.filter((b) => b.height > 0)} heightOf={blockHeight} baseY={0} />
    </>
  );
}
