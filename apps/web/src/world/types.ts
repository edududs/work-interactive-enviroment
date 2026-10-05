// Tipos próprios do mundo. O mundo não sabe o que é um agente de IA;
// só conhece entidades com posição, sprite e um rótulo opcional.

export interface WorldEntity {
  id: string;
  sprite: string;
  /** Posição em pixels do mapa do Tiled (mesma convenção da API). */
  x: number;
  y: number;
  label?: string;
}

export interface WorldConfig {
  tilemapUrl: string;
  spawn: { x: number; y: number };
  entities: WorldEntity[];
}
