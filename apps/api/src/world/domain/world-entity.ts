import { requireNonEmpty } from '../../shared/domain/invariant.js';
import type { Position } from './position.js';

interface EntityBase {
  readonly id: string;
  readonly position: Position;
  readonly sprite: string;
}

/**
 * Something placed on a map. An agent is linked to the agents context only by `agentId`: the world
 * never knows what is on the other side of that id.
 */
export type WorldEntity =
  (EntityBase & { readonly kind: 'agent'; readonly agentId: string }) | (EntityBase & { readonly kind: 'object' });

export function agentEntity(props: { id: string; position: Position; sprite: string; agentId: string }): WorldEntity {
  return {
    kind: 'agent',
    id: requireNonEmpty(props.id, 'entity id'),
    position: props.position,
    sprite: requireNonEmpty(props.sprite, 'entity sprite'),
    agentId: requireNonEmpty(props.agentId, 'agent id'),
  };
}

export function objectEntity(props: { id: string; position: Position; sprite: string }): WorldEntity {
  return {
    kind: 'object',
    id: requireNonEmpty(props.id, 'entity id'),
    position: props.position,
    sprite: requireNonEmpty(props.sprite, 'entity sprite'),
  };
}
