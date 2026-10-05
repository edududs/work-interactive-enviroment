import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { InvariantError } from '../../shared/domain/invariant.js';
import { Position } from './position.js';

describe('Position', () => {
  it('keeps any finite, non-negative coordinates', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 1e6, noNaN: true }),
        fc.double({ min: 0, max: 1e6, noNaN: true }),
        (x, y) => {
          const p = Position.of(x, y);
          expect([p.x, p.y]).toEqual([x, y]);
        },
      ),
    );
  });

  it('refuses negative coordinates', () => {
    fc.assert(
      fc.property(fc.double({ max: -Number.MIN_VALUE, noNaN: true }), (negative) => {
        expect(() => Position.of(negative, 0)).toThrow(InvariantError);
        expect(() => Position.of(0, negative)).toThrow(InvariantError);
      }),
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY])('refuses %s', (bad) => {
    expect(() => Position.of(bad, 0)).toThrow(InvariantError);
    expect(() => Position.of(0, bad)).toThrow(InvariantError);
  });
});
