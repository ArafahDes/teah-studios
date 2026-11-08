import { claimSlot } from '../../../shared/bespokeSlots.js';
import {
  corsHeaders,
  handleOptions,
  json,
  kvMissingResponse,
  readStore,
  writeStore,
} from '../../_lib/store.js';

export async function onRequestOptions(context) {
  return handleOptions(context.request);
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json().catch(() => ({}));
    const store = await readStore(context.env);
    const result = claimSlot(store, body?.clientId);

    if (result.status === 201) {
      await writeStore(context.env, store);
    }

    return json(result.body, result.status, corsHeaders(context.request));
  } catch (err) {
    if (err.code === 'NO_KV') return kvMissingResponse(context.request, err);
    return json(
      { ok: false, error: 'server_error', message: err.message },
      500,
      corsHeaders(context.request),
    );
  }
}
