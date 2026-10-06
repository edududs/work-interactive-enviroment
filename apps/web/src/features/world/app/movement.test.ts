import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { gridFrom } from './grid.fixture';
import { type Circle, moveWithCollisions, PLAYER_SPEED, stepFor } from './movement';

const room = gridFrom(['#####', '#...#', '#...#', '#...#', '#####']);

const overlapsSolid = (c: Circle) => {
  for (let z = Math.floor(c.z - c.r); z <= Math.floor(c.z + c.r); z++) {
    for (let x = Math.floor(c.x - c.r); x <= Math.floor(c.x + c.r); x++) {
      if (!room.solid[z * room.width + x]) continue;
      const nx = Math.max(x, Math.min(c.x, x + 1));
      const nz = Math.max(z, Math.min(c.z, z + 1));
      if ((c.x - nx) ** 2 + (c.z - nz) ** 2 < c.r * c.r) return true;
    }
  }
  return false;
};

describe('moveWithCollisions', () => {
  it('moves freely on open floor', () => {
    const body = { x: 2.5, z: 2.5, r: 0.3 };
    moveWithCollisions(room, body, 0.2, -0.1, []);
    expect(body).toEqual({ x: 2.7, z: 2.4, r: 0.3 });
  });

  it('stops at a wall but keeps sliding along it', () => {
    const body = { x: 1.4, z: 2.5, r: 0.3 };
    moveWithCollisions(room, body, -0.5, 0.2, []);
    expect(body.x).toBe(1.4);
    expect(body.z).toBeCloseTo(2.7);
  });

  it('stops at another character', () => {
    const body = { x: 2, z: 2.5, r: 0.3 };
    moveWithCollisions(room, body, 0.3, 0, [{ x: 2.8, z: 2.5, r: 0.3 }]);
    expect(body.x).toBe(2);
  });

  it('treats the outside of the map as solid', () => {
    const open = gridFrom(['...']);
    const body = { x: 0.5, z: 0.5, r: 0.3 };
    moveWithCollisions(open, body, -1, 0, []);
    expect(body.x).toBe(0.5);
  });

  it('never ends inside a wall, whatever the sequence of steps', () => {
    const step = fc.record({
      dx: fc.double({ min: -0.3, max: 0.3, noNaN: true }),
      dz: fc.double({ min: -0.3, max: 0.3, noNaN: true }),
    });
    fc.assert(
      fc.property(fc.array(step, { maxLength: 200 }), (steps) => {
        const body = { x: 2.5, z: 2.5, r: 0.3 };
        for (const { dx, dz } of steps) moveWithCollisions(room, body, dx, dz, []);
        expect(overlapsSolid(body)).toBe(false);
      }),
    );
  });
});

describe('stepFor', () => {
  it('does not move without a direction', () => {
    expect(stepFor({ x: 0, z: 0 }, 1)).toEqual({ dx: 0, dz: 0 });
  });

  it('walks diagonals at the same speed as straight lines', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(-1, 0, 1),
        fc.constantFrom(-1, 0, 1),
        fc.double({ min: 0.001, max: 0.1, noNaN: true }),
        (x, z, dt) => {
          fc.pre(x !== 0 || z !== 0);
          const { dx, dz } = stepFor({ x, z }, dt);
          expect(Math.hypot(dx, dz)).toBeCloseTo(PLAYER_SPEED * dt);
        },
      ),
    );
  });
});
