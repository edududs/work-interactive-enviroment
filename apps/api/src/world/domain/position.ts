import { InvariantError } from '../../shared/domain/invariant.js';

/**
 * A point on a map, in tiles: 5.5 is the center of tile 5. Tiles, not pixels, so a map keeps its
 * positions when its art changes resolution. Never negative, never NaN.
 */
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
