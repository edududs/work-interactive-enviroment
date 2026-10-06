import { requireNonEmpty } from '../../shared/domain/invariant.js';

/**
 * An AI agent: who it is and what it does. Model, prompt and tools join in phase 3.
 * It knows nothing about maps; the world points at it by id.
 */
export class Agent {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly role: string,
  ) {}

  static create(props: { id: string; name: string; role: string }): Agent {
    return new Agent(
      requireNonEmpty(props.id, 'agent id'),
      requireNonEmpty(props.name, 'agent name'),
      requireNonEmpty(props.role, 'agent role'),
    );
  }
}
