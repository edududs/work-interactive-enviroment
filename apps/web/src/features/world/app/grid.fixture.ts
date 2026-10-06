import type { GridMap } from '../domain/grid-map';

/**
 * A grid from text: '#' is a solid tile, '.' is floor. Rows are z, columns are x.
 * Reads like the map it describes, so tests show the situation at a glance.
 */
export function gridFrom(rows: readonly string[]): GridMap {
  const height = rows.length;
  const width = rows[0]?.length ?? 0;
  const solid = rows.flatMap((row) => Array.from(row, (c) => c === '#'));
  return { width, height, tileSize: 32, floor: [], blocks: [], solid };
}
