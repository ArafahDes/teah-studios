const API_BASE = import.meta.env.VITE_API_URL || '';

function clientKey() {
  const key = 'teah-bespoke-client-id';
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `anon-${Date.now()}`;
  }
}

function claimedKey(month) {
  return `teah-bespoke-claimed-${month}`;
}

export async function fetchBespokeSlots() {
  const res = await fetch(`${API_BASE}/api/bespoke-slots`);
  if (!res.ok) throw new Error('Failed to load slots');
  return res.json();
}

export async function claimBespokeSlot() {
  const clientId = clientKey();
  const res = await fetch(`${API_BASE}/api/bespoke-slots/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && res.status !== 409) {
    throw new Error(data.error || 'Failed to claim slot');
  }
  if (data.ok && data.month) {
    try {
      localStorage.setItem(claimedKey(data.month), '1');
    } catch {
      /* ignore */
    }
  }
  return { ...data, status: res.status };
}

export function hasClaimedThisMonth(month) {
  if (!month) return false;
  try {
    return localStorage.getItem(claimedKey(month)) === '1';
  } catch {
    return false;
  }
}
