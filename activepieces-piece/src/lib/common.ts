import { PieceAuth } from '@activepieces/pieces-framework';

export const BASE_URL = 'https://api.groundsocial.dev';

export const groundsocialAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description:
    'Your Groundsocial API key (starts with gs_live_). Create one at https://groundsocial.dev/app/sign-in?new=1 (100 free credits). Saving it makes one 1-credit test call.',
  required: true,
  validate: async ({ auth }) => {
    try {
      await request(keyOf(auth), 'GET', '/v1/hackernews/stories', { limit: 1 });
      return { valid: true };
    } catch (e) {
      return { valid: false, error: (e as Error).message };
    }
  },
});

export function keyOf(auth: unknown): string {
  if (typeof auth === 'string') return auth;
  return (auth as { secret_text?: string } | undefined)?.secret_text ?? '';
}

export interface Endpoint {
  id: string;
  tool: string;
  platform: string;
  method: string;
  path: string;
  title: string;
  credits: number | null;
  inputs: string[];
}

type Params = Record<string, unknown>;

export async function request(apiKey: string | undefined, method: string, path: string, query: Params = {}, body?: Params): Promise<unknown> {
  const url = new URL(BASE_URL + path);
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    url.searchParams.set(k, Array.isArray(v) ? v.join(',') : String(v));
  }
  const headers: Record<string, string> = { accept: 'application/json' };
  if (apiKey) headers['authorization'] = `Bearer ${apiKey}`;
  if (body) headers['content-type'] = 'application/json';
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    // not JSON
  }
  if (!res.ok) {
    const err = data?.error ?? { code: `http_${res.status}`, message: text.slice(0, 300) };
    throw new Error(`${err.code}: ${err.message}${err.hint ? ` (${err.hint})` : ''}`);
  }
  return data;
}

let endpointsCache: Promise<Endpoint[]> | undefined;

export function listEndpoints(): Promise<Endpoint[]> {
  if (!endpointsCache) {
    endpointsCache = request(undefined, 'GET', '/v1/utility/endpoints').then((d) => (d as { endpoints: Endpoint[] }).endpoints);
    endpointsCache.catch(() => (endpointsCache = undefined));
  }
  return endpointsCache;
}

export async function callEndpoint(apiKey: string, endpointId: string, params: Params = {}): Promise<unknown> {
  const endpoints = await listEndpoints();
  const ep = endpoints.find((e) => e.id === endpointId || e.tool === endpointId);
  if (!ep) throw new Error(`unknown_endpoint: No endpoint called "${endpointId}". Use Find Endpoints to look it up.`);
  const input: Params = { ...params };
  let path = ep.path;
  for (const [placeholder, name] of ep.path.matchAll(/\{([^}]+)\}/g)) {
    const v = input[name];
    if (v === undefined || v === null || v === '') {
      throw new Error(`invalid_request: ${ep.id} needs the "${name}" input (inputs: ${ep.inputs.join(', ')})`);
    }
    path = path.replace(placeholder, encodeURIComponent(String(v)));
    delete input[name];
  }
  const method = ep.method.toUpperCase();
  return method === 'GET' ? request(apiKey, 'GET', path, input) : request(apiKey, method, path, {}, input);
}
