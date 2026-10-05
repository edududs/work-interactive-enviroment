import * as THREE from 'three';
import type { Block, GridMap } from './tiledMap';

const FLOOR_THICKNESS = 0.1;

/** Um InstancedMesh por camada: o mapa inteiro custa 2 draw calls. */
function instancedBlocks(blocks: Block[], heightOf: (b: Block) => number, yOf: (b: Block) => number) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial();
  const mesh = new THREE.InstancedMesh(geometry, material, blocks.length);
  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  blocks.forEach((b, i) => {
    const h = heightOf(b);
    matrix.makeScale(1, h, 1).setPosition(b.x + 0.5, yOf(b) + h / 2, b.z + 0.5);
    mesh.setMatrixAt(i, matrix);
    mesh.setColorAt(i, color.set(b.color));
  });
  return mesh;
}

export function buildMapMeshes(map: GridMap): THREE.Object3D {
  const group = new THREE.Group();
  group.add(instancedBlocks(map.floor, () => FLOOR_THICKNESS, () => -FLOOR_THICKNESS));
  group.add(instancedBlocks(map.blocks.filter((b) => b.height > 0), (b) => b.height, () => 0));
  return group;
}
