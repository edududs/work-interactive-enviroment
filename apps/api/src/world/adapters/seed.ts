import { Position } from '../domain/position.js';
import { agentEntity } from '../domain/world-entity.js';
import { WorldMap } from '../domain/world-map.js';

/** Center of a tile. */
const tile = (x: number, y: number) => Position.of(x + 0.5, y + 0.5);

/** The only map until maps are persisted (phase 4). Its layout lives in the web app's Tiled file. */
export const officeMap = WorldMap.create({
  id: 'office',
  tilemapUrl: '/maps/office.json',
  spawn: tile(5, 13),
  entities: [
    agentEntity({ id: 'npc-dev', position: tile(6, 4), sprite: 'npc-dev', agentId: 'dev-ai' }),
    agentEntity({ id: 'npc-research', position: tile(22, 4), sprite: 'npc-research', agentId: 'research-ai' }),
  ],
});
