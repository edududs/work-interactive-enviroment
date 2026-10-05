import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Block, GridMap } from '../map/tiledMap';

const FLOOR_THICKNESS = 0.1;

/**
 * Um instancedMesh por camada: o mapa inteiro custa 2 draw calls.
 * As matrizes são escritas uma vez; nenhum componente React por tile.
 */
function BlockLayer({ blocks, heightOf, baseY }: { blocks: Block[]; heightOf: (b: Block) => number; baseY: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current!;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
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

export function MapMeshes({ map }: { map: GridMap }) {
  return (
    <>
      <BlockLayer blocks={map.floor} heightOf={floorHeight} baseY={-FLOOR_THICKNESS} />
      <BlockLayer blocks={map.blocks.filter((b) => b.height > 0)} heightOf={blockHeight} baseY={0} />
    </>
  );
}
