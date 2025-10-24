const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
app.use(express.json());

const API_KEY = process.env.API_FOOTBALL_KEY;
const APP_CLIENT_TOKEN = process.env.APP_CLIENT_TOKEN;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const CACHE_TTL = parseInt(process.env.CACHE_TTL || '30', 10);
const RL_WINDOW_MS = parseInt(process.env.RL_WINDOW_MS || '60000', 10);
const RL_MAX = parseInt(process.env.RL_MAX || '60', 10);

if (!API_KEY) {
  console.error('ERROR: API_FOOTBALL_KEY env değişkenini set etmelisin.');
  process.exit(1);
}

app.use(cors({ origin: CORS_ORIGIN }));
app.use(rateLimit({ windowMs: RL_WINDOW_MS, max: RL_MAX }));

app.use((req, res, next) => {
  if (!APP_CLIENT_TOKEN) return next();
  const hdr = req.header('x-golex-client');
  if (hdr && hdr === APP_CLIENT_TOKEN) return next();
  return res.status(401).json({ error: 'unauthorized' });
});

const BASE = 'https://v3.football.api-sports.io';
const cache = new NodeCache({ stdTTL: CACHE_TTL });

async function proxyGet(path, params) {
  const key = path + JSON.stringify(params || {});
  const hit = cache.get(key);
  if (hit) return hit;

  const { data } = await axios.get(BASE + path, {
    params,
    headers: { 'x-apisports-key': API_KEY }
  });
  cache.set(key, data);
  return data;
}

app.get('/', (req, res) => res.send('GOLEX gateway ok'));
app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/leagues', async (req, res) => {
  try { res.json(await proxyGet('/leagues', req.query)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

app.get('/fixtures', async (req, res) => {
  try { res.json(await proxyGet('/fixtures', req.query)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

app.get('/teams', async (req, res) => {
  try { res.json(await proxyGet('/teams', req.query)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

app.get('/standings', async (req, res) => {
  try { res.json(await proxyGet('/standings', req.query)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

app.get('/events', async (req, res) => {
  try { res.json(await proxyGet('/fixtures/events', req.query)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

app.get('/odds', async (req, res) => {
  try { res.json(await proxyGet('/odds', req.query)); }
  catch(e){ res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening on ' + PORT));
