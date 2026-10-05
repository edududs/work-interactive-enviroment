import * as Phaser from 'phaser';
import type { WorldEntity } from '../types';

export class Npc extends Phaser.Physics.Arcade.Sprite {
  readonly entityId: string;

  constructor(scene: Phaser.Scene, entity: WorldEntity) {
    super(scene, entity.x, entity.y, entity.sprite);
    this.entityId = entity.id;
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // corpo estático: o jogador colide mas não empurra
    (this.body as Phaser.Physics.Arcade.StaticBody).setCircle(11, 3, 4);
    this.setDepth(9);

    if (entity.label) {
      scene.add
        .text(entity.x, entity.y - 24, entity.label, {
          fontFamily: 'system-ui, sans-serif',
          fontSize: '12px',
          color: '#ffffff',
          backgroundColor: 'rgba(17,24,39,0.75)',
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5, 1)
        .setDepth(20);
    }
  }
}
