/** A use case asked for something that does not exist. Adapters translate it to their own idiom. */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
