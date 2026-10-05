const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/** The only door to the network. Paths starting with "/" and no API prefix are served by the web app. */
export async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} falhou: ${String(res.status)}`);
  return res.json();
}

export const apiUrl = (path: string): string => `${API_URL}${path}`;
