import { InvariantError, requireNonEmpty } from '../../shared/domain/invariant.js';
import type { Position } from './position.js';
import type { WorldEntity } from './world-entity.js';

interface WorldMapProps {
  id: string;
  tilemapUrl: string;
  spawn: Position;
  entities: readonly WorldEntity[];
}

/** Aggregate root of the world context: one map, where players spawn and what stands on it. */
export class WorldMap {
  private constructor(
    readonly id: string,
    readonly tilemapUrl: string,
    readonly spawn: Position,
    readonly entities: readonly WorldEntity[],
  ) {}

  static create(props: WorldMapProps): WorldMap {
    const ids = new Set<string>();
    for (const entity of props.entities) {
      if (ids.has(entity.id)) throw new InvariantError(`entity id ${entity.id} appears twice on the map`);
      ids.add(entity.id);
    }
    return new WorldMap(
      requireNonEmpty(props.id, 'map id'),
      requireNonEmpty(props.tilemapUrl, 'tilemap url'),
      props.spawn,
      [...props.entities],
    );
  }
}
