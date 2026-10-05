import * as THREE from 'three';
import { CHARACTER_RADIUS, createCharacter } from '../entities/character';
import { buildMapMeshes } from '../map/buildMapMeshes';
import { loadTiledMap } from '../map/tiledMap';
import { createKeyboardInput } from '../systems/input';
import { moveWithCollisions, PLAYER_SPEED, type Circle } from '../systems/movement';
import { findNearby } from '../systems/proximity';
import type { WorldConfig, WorldEvents } from '../types';

export interface WorldHandle {
  on<E extends keyof WorldEvents>(event: E, listener: WorldEvents[E]): void;
  destroy(): void;
}

// Câmera fixa em terceira pessoa, de cima e de trás: paredes baixas não escondem o jogador.
const CAMERA_OFFSET = new THREE.Vector3(0, 11, 8.5);

/** Único ponto de entrada do motor 3D. O React só conversa com o mundo por aqui. */
export async function createWorld(parent: HTMLElement, config: WorldConfig): Promise<WorldHandle> {
  const map = await loadTiledMap(config.tilemapUrl);
  const toWorld = (px: number) => px / map.tileSize;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  // Limitar o pixel ratio é o que mais pesa em notebook com tela retina.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  parent.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1f2937');
  scene.add(new THREE.HemisphereLight('#ffffff', '#4b5563', 2));
  const sun = new THREE.DirectionalLight('#ffffff', 1.5);
  sun.position.set(-5, 10, 4);
  scene.add(sun);
  scene.add(buildMapMeshes(map));

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

  const player = createCharacter('player');
  const playerBody: Circle = { x: toWorld(config.spawn.x), z: toWorld(config.spawn.y), r: CHARACTER_RADIUS };
  scene.add(player);

  const npcs = config.entities.map((e) => {
    const mesh = createCharacter(e.sprite, e.label);
    const pos = { id: e.id, x: toWorld(e.x), z: toWorld(e.y) };
    mesh.position.set(pos.x, 0, pos.z);
    scene.add(mesh);
    return pos;
  });
  const obstacles: Circle[] = npcs.map((n) => ({ x: n.x, z: n.z, r: CHARACTER_RADIUS }));

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = parent;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);
  resize();

  const input = createKeyboardInput();
  const events = new THREE.EventDispatcher<{ nearbyEntityChanged: { id: string | null } }>();
  let nearbyId: string | null = null;
  const timer = new THREE.Timer();
  let walkTime = 0;

  const placeCamera = (lerp: number) => {
    const target = new THREE.Vector3(playerBody.x, 0, playerBody.z);
    camera.position.lerp(target.clone().add(CAMERA_OFFSET), lerp);
    camera.lookAt(camera.position.clone().sub(CAMERA_OFFSET));
  };
  player.position.set(playerBody.x, 0, playerBody.z);
  placeCamera(1);

  renderer.setAnimationLoop(() => {
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.1); // evita "teleporte" depois de trocar de aba

    const dir = input.direction();
    const len = Math.hypot(dir.x, dir.z);
    if (len > 0) {
      const step = (PLAYER_SPEED * dt) / len;
      moveWithCollisions(map, playerBody, dir.x * step, dir.z * step, obstacles);
      player.rotation.y = Math.atan2(dir.x, dir.z);
      walkTime += dt;
    } else {
      walkTime = 0;
    }
    player.position.set(playerBody.x, Math.abs(Math.sin(walkTime * 12)) * 0.06, playerBody.z);
    placeCamera(1 - Math.exp(-dt * 8));

    // Só avisa o React quando muda, para não renderizar a UI a cada frame.
    const id = findNearby(playerBody, npcs);
    if (id !== nearbyId) {
      nearbyId = id;
      events.dispatchEvent({ type: 'nearbyEntityChanged', id });
    }

    renderer.render(scene, camera);
  });

  return {
    on(event, listener) {
      events.addEventListener(event, (e) => listener(e.id));
    },
    destroy() {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      input.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Sprite) {
          obj.geometry.dispose();
          const material = obj.material as THREE.Material & { map?: THREE.Texture | null };
          material.map?.dispose();
          material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
