// Communication contracts between web and api. No internal backend entity ever lives here.

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
  /** Links the world entity to the agents context. The world never knows what is on the other side. */
  agentId?: string;
}

export interface MapStateDTO {
  mapId: string;
  /** Path of the Tiled JSON served by the web app (e.g. /maps/office.json). */
  tilemapUrl: string;
  spawn: { x: number; y: number };
  entities: WorldEntityDTO[];
}

export interface AgentDTO {
  id: string;
  name: string;
  role: string;
}
