import * as THREE from 'three';

// Personagens low-poly feitos de primitivas até termos modelos glTF.
const CHARACTER_COLORS: Record<string, string> = {
  player: '#3b82f6',
  'npc-dev': '#22c55e',
  'npc-research': '#a855f7',
};

export const CHARACTER_RADIUS = 0.3;

export function createCharacter(sprite: string, label?: string): THREE.Group {
  const color = CHARACTER_COLORS[sprite] ?? '#9ca3af';
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(CHARACTER_RADIUS, 0.45, 4, 10),
    new THREE.MeshLambertMaterial({ color }),
  );
  body.position.y = 0.55;
  group.add(body);

  // "Visor" na frente para dar direção ao personagem (+z é a frente).
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.12, 0.08),
    new THREE.MeshLambertMaterial({ color: '#111827' }),
  );
  visor.position.set(0, 0.78, CHARACTER_RADIUS - 0.02);
  group.add(visor);

  // Sombra falsa: um disco escuro é bem mais barato que shadow maps.
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(CHARACTER_RADIUS * 1.1, 16),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.25, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  group.add(shadow);

  if (label) group.add(createLabel(label));
  return group;
}

function createLabel(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const font = '600 28px system-ui, sans-serif';
  ctx.font = font;
  canvas.width = Math.ceil(ctx.measureText(text).width) + 24;
  canvas.height = 44;
  ctx.font = font;
  ctx.fillStyle = 'rgba(17,24,39,0.8)';
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, 10);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 12, canvas.height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
  const scale = 0.0075;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  sprite.position.y = 1.35;
  sprite.renderOrder = 10;
  return sprite;
}
