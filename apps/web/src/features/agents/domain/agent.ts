/** An AI agent as the web app sees it. The rules about agents live in the API. */
export interface Agent {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}
