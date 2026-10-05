import * as Phaser from 'phaser';
import { CHARACTER_SIZE } from './textures';

const SPEED = 160;

type Keys = Record<'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private keys: Keys;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(10);
    // Hitbox menor que o sprite para passar por portas de 2 tiles com folga.
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(10, CHARACTER_SIZE / 2 - 10, CHARACTER_SIZE / 2 - 8);
    body.setCollideWorldBounds(true);

    // enableCapture = false: não engole as teclas quando o foco estiver num input do React.
    this.keys = scene.input.keyboard!.addKeys('UP,DOWN,LEFT,RIGHT,W,A,S,D', false) as Keys;
  }

  /** Lê o teclado e aplica velocidade. Chamado a cada frame pela cena. */
  updateMovement() {
    const k = this.keys;
    const dx = (k.RIGHT.isDown || k.D.isDown ? 1 : 0) - (k.LEFT.isDown || k.A.isDown ? 1 : 0);
    const dy = (k.DOWN.isDown || k.S.isDown ? 1 : 0) - (k.UP.isDown || k.W.isDown ? 1 : 0);
    const v = new Phaser.Math.Vector2(dx, dy).normalize().scale(SPEED);
    this.setVelocity(v.x, v.y);
    if (dx !== 0) this.setFlipX(dx < 0);
  }
}
