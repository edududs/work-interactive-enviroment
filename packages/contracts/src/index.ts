// Contratos de comunicação entre web e api. Nada de entidades internas do backend aqui.

export type WorldEntityType = 'player' | 'agent' | 'object';

export interface PositionDTO {
  x: number;
  y: number;
  mapId: string;
}

export interface WorldEntityDTO {
  id: string;
  type: WorldEntityType;
  position: PositionDTO;
  sprite: string;
  /** Liga a entidade do mundo ao domínio de agentes. O mundo não sabe o que há do outro lado. */
  agentId?: string;
}

export interface MapStateDTO {
  mapId: string;
  /** Caminho do JSON do Tiled servido pelo web (ex.: /maps/office.json). */
  tilemapUrl: string;
  spawn: { x: number; y: number };
  entities: WorldEntityDTO[];
}

export interface AgentDTO {
  id: string;
  name: string;
  role: string;
}
