import { InvariantError } from '../../shared/domain/invariant.js';

/** A point on a map, in map pixels (the Tiled convention). Never negative, never NaN. */
export class Position {
  private constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  static of(x: number, y: number): Position {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new InvariantError(`position must be finite, got (${String(x)}, ${String(y)})`);
    }
    if (x < 0 || y < 0) throw new InvariantError(`position must not be negative, got (${String(x)}, ${String(y)})`);
    return new Position(x, y);
  }
}
