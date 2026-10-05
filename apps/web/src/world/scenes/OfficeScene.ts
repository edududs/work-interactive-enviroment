import * as Phaser from 'phaser';
import { Npc } from '../entities/Npc';
import { Player } from '../entities/Player';
import { registerCharacterTextures } from '../entities/textures';
import { findNearbyNpc } from '../systems/proximity';
import type { WorldConfig } from '../types';

export class OfficeScene extends Phaser.Scene {
  private config!: WorldConfig;
  private player!: Player;
  private npcs: Npc[] = [];
  private nearbyId: string | null = null;

  constructor() {
    super('office');
  }

  init(config: WorldConfig) {
    this.config = config;
  }

  preload() {
    this.load.tilemapTiledJSON('office-map', this.config.tilemapUrl);
    this.load.image('office-tiles', this.config.tilesetUrl);
  }

  create() {
    registerCharacterTextures(this);

    const map = this.make.tilemap({ key: 'office-map' });
    const tileset = map.addTilesetImage('office', 'office-tiles')!;
    map.createLayer('ground', tileset, 0, 0);
    const walls = map.createLayer('walls', tileset, 0, 0)!;
    walls.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player(this, this.config.spawn.x, this.config.spawn.y);
    this.npcs = this.config.entities.map((e) => new Npc(this, e));

    this.physics.add.collider(this.player, walls);
    this.physics.add.collider(this.player, this.npcs);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    camera.startFollow(this.player, true, 0.15, 0.15);
    camera.setRoundPixels(true);
  }

  update() {
    this.player.updateMovement();

    // Só avisa o React quando muda, para não renderizar a UI a cada frame.
    const nearbyId = findNearbyNpc(this.player, this.npcs)?.entityId ?? null;
    if (nearbyId !== this.nearbyId) {
      this.nearbyId = nearbyId;
      this.game.events.emit('nearbyEntityChanged', nearbyId);
    }
  }
}
