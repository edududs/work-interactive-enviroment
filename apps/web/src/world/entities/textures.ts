import * as Phaser from 'phaser';

// Placeholders desenhados em tempo de execução até termos spritesheets de verdade.
const CHARACTER_COLORS: Record<string, number> = {
  player: 0x3b82f6,
  'npc-dev': 0x22c55e,
  'npc-research': 0xa855f7,
};

export const CHARACTER_SIZE = 28;

export function registerCharacterTextures(scene: Phaser.Scene) {
  for (const [key, color] of Object.entries(CHARACTER_COLORS)) {
    if (scene.textures.exists(key)) continue;
    const g = scene.add.graphics();
    const r = CHARACTER_SIZE / 2;
    g.fillStyle(0x000000, 0.25).fillEllipse(r, CHARACTER_SIZE - 3, CHARACTER_SIZE - 6, 6);
    g.fillStyle(color, 1).fillCircle(r, r - 1, r - 2);
    g.lineStyle(2, 0x1f2937, 1).strokeCircle(r, r - 1, r - 2);
    g.fillStyle(0xffffff, 1).fillCircle(r - 5, r - 4, 3).fillCircle(r + 5, r - 4, 3);
    g.fillStyle(0x111827, 1).fillCircle(r - 5, r - 3, 1.5).fillCircle(r + 5, r - 3, 1.5);
    g.generateTexture(key, CHARACTER_SIZE, CHARACTER_SIZE);
    g.destroy();
  }
}
