import { STORE_KEY, emptyStore } from '../../shared/bespokeSlots.js';

export function requireKv(env) {
  if (!env?.BESPOKE_SLOTS) {
    const err = new Error(
      'BESPOKE_SLOTS KV binding is missing. Create a KV namespace and bind it as BESPOKE_SLOTS in Cloudflare Pages settings or wrangler.toml.',
    );
    err.code = 'NO_KV';
    throw err;
  }
  return env.BESPOKE_SLOTS;
}

export async function readStore(env) {
  const kv = requireKv(env);
  const raw = await kv.get(STORE_KEY, 'json');
  if (!raw || typeof raw !== 'object' || !raw.months) return emptyStore();
  return raw;
}

export async function writeStore(env, store) {
  const kv = requireKv(env);
  await kv.put(STORE_KEY, JSON.stringify(store));
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

export function handleOptions(request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export function kvMissingResponse(request, err) {
  return json(
    { ok: false, error: 'kv_missing', message: err.message },
    503,
    corsHeaders(request),
  );
}
