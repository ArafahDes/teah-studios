import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  claimSlot,
  emptyStore,
  monthState,
} from '../shared/bespokeSlots.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'bespoke-slots.json');
const PORT = Number(process.env.PORT) || 8787;

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(emptyStore(), null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!raw || typeof raw !== 'object' || !raw.months) return emptyStore();
    return raw;
  } catch {
    return emptyStore();
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, runtime: 'node-express' });
});

app.get('/api/bespoke-slots', (_req, res) => {
  res.json(monthState(readStore()));
});

app.post('/api/bespoke-slots/claim', (req, res) => {
  const store = readStore();
  const result = claimSlot(store, req.body?.clientId);
  if (result.status === 201) writeStore(store);
  res.status(result.status).json(result.body);
});

app.listen(PORT, () => {
  ensureStore();
  console.log(`TEÁH slots API on http://localhost:${PORT}`);
});
