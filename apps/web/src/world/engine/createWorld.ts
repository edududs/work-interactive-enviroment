import * as Phaser from 'phaser';
import { OfficeScene } from '../scenes/OfficeScene';
import type { WorldConfig, WorldEvents } from '../types';

export interface WorldHandle {
  on<E extends keyof WorldEvents>(event: E, listener: WorldEvents[E]): void;
  destroy(): void;
}

/** Único ponto de entrada do Phaser. O React só conversa com o mundo por aqui. */
export function createWorld(parent: HTMLElement, config: WorldConfig): WorldHandle {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 540,
    backgroundColor: '#1f2937',
    pixelArt: true,
    physics: { default: 'arcade', arcade: { debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  });
  game.scene.add('office', OfficeScene, true, config);

  return {
    on(event, listener) {
      game.events.on(event, listener);
    },
    destroy() {
      game.destroy(true);
    },
  };
}
