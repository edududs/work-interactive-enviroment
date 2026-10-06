/** The only door to the network. */
export async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} falhou: ${String(res.status)}`);
  return res.json();
}

/**
 * API calls go to the web app's own origin under /api; next.config.ts forwards them to the API.
 * The browser never needs to know where the API lives, so no build can point users at localhost.
 */
export const apiUrl = (path: string): string => `/api${path}`;
