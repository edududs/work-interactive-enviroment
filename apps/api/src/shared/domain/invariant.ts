/** An invariant of the domain was broken while building a value or an entity. */
export class InvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export function requireNonEmpty(value: string, what: string): string {
  const trimmed = value.trim();
  if (trimmed === '') throw new InvariantError(`${what} must not be empty`);
  return trimmed;
}
