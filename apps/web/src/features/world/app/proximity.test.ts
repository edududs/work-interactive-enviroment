import { describe, expect, it } from 'vitest';
import { findNearby, INTERACTION_DISTANCE } from './proximity';

describe('findNearby', () => {
  const npcs = [
    { id: 'far', x: 10, z: 10 },
    { id: 'close', x: 1, z: 0 },
    { id: 'closer', x: 0.5, z: 0 },
  ];

  it('picks the closest entity inside the radius', () => {
    expect(findNearby({ x: 0, z: 0 }, npcs)).toBe('closer');
  });

  it('answers null when nobody is inside the radius', () => {
    expect(findNearby({ x: 5, z: 5 }, npcs)).toBeNull();
  });

  it('includes the edge of the radius', () => {
    expect(findNearby({ x: 0, z: 0 }, [{ id: 'edge', x: INTERACTION_DISTANCE, z: 0 }])).toBe('edge');
  });
});
