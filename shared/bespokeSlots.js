export const MAX_SLOTS = 4;
export const STORE_KEY = 'bespoke-slots:v1';

export function monthKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function emptyStore() {
  return { months: {} };
}

export function monthState(store, key = monthKey()) {
  const entry = store.months[key] || { claims: [] };
  const claimed = entry.claims.length;
  const remaining = Math.max(0, MAX_SLOTS - claimed);
  return {
    month: key,
    max: MAX_SLOTS,
    claimed,
    remaining,
    full: claimed >= MAX_SLOTS,
    message:
      claimed >= MAX_SLOTS
        ? 'Slots occupied for the month'
        : remaining === 1
          ? '1 slot left this month'
          : `${remaining} slots left this month`,
  };
}

/** Apply a claim. Mutates store. Returns { status, body }. */
export function claimSlot(store, clientIdRaw) {
  const clientId = String(clientIdRaw || '').trim().slice(0, 120);
  const key = monthKey();
  if (!store.months[key]) store.months[key] = { claims: [] };

  const entry = store.months[key];
  if (entry.claims.length >= MAX_SLOTS) {
    return {
      status: 409,
      body: {
        ok: false,
        error: 'full',
        ...monthState(store, key),
      },
    };
  }

  if (clientId && entry.claims.some((c) => c.clientId === clientId)) {
    return {
      status: 200,
      body: {
        ok: true,
        alreadyClaimed: true,
        ...monthState(store, key),
      },
    };
  }

  entry.claims.push({
    clientId: clientId || null,
    at: new Date().toISOString(),
  });

  return {
    status: 201,
    body: {
      ok: true,
      alreadyClaimed: false,
      ...monthState(store, key),
    },
  };
}
