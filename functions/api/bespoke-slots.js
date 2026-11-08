import { monthState } from '../../shared/bespokeSlots.js';
import {
  corsHeaders,
  handleOptions,
  json,
  kvMissingResponse,
  readStore,
} from '../_lib/store.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestGet(context) {
  try {
    const store = await readStore(context.env);
    return json(monthState(store), 200, corsHeaders(context.request));
  } catch (err) {
    if (err.code === 'NO_KV') return kvMissingResponse(context.request, err);
    return json(
      { ok: false, error: 'server_error', message: err.message },
      500,
      corsHeaders(context.request),
    );
  }
}
