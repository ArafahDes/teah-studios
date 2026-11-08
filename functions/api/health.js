import { corsHeaders, handleOptions, json } from '../_lib/store.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestGet(context) {
  return json(
    {
      ok: true,
      runtime: 'cloudflare-pages',
      hasKv: Boolean(context.env?.BESPOKE_SLOTS),
    },
    200,
    corsHeaders(context.request),
  );
}
