'use strict';

/**
 * GOLEX Gateway — server.js (FULL FILE)
 * - Public: GET /health, GET /
 * - Protected: all other API routes via APP_CLIENT_TOKEN header (x-golex-client)
 * - CORS: * with GET/OPTIONS + needed headers
 */

const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { URLSearchParams } = require('url');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_FOOTBALL_KEY || '';
const APP_CLIENT_TOKEN = process.env.APP_CLIENT_TOKEN || '';
const RL_MAX = parseInt(process.env.RL_MAX || '120', 10);
const RL_WINDOW_MS = parseInt(process.env.RL_WINDOW_MS || '60000', 10);
const APISPORTS_BASE = process.env.APISPORTS_BASE || 'https://v3.football.api-sports.io';

if (!process.env.API_FOOTBALL_KEY) {
  console.warn('[WARN] API_FOOTBALL_KEY is empty — upstream calls will fail.');
}

const app = express();
app.disable('x-powered-by');
app.use(morgan('tiny'));

// 1) CORS (open but minimal)
const corsAll = require('./server/node/cors-all');
app.use(corsAll);

// 2) Public routes
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.json({ ok: true, service: 'golex-gateway' }));

// 3) Auth guard for the rest (skip preflight + public)
const check = require('./server/node/checkAppClientToken');
app.use(check(APP_CLIENT_TOKEN));

// 4) Basic rate limit
app.use(rateLimit({
  windowMs: RL_WINDOW_MS,
  max: RL_MAX,
  standardHeaders: true,
  legacyHeaders: false,
}));

// 5) Example: proxy /fixtures to API-Sports
app.get('/fixtures', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ ok: false, error: 'missing_api_key' });
    }
    const qs = new URLSearchParams(req.query).toString();
    const url = `${APISPORTS_BASE}/fixtures${qs ? `?${qs}` : ''}`;

    const upstream = await fetch(url, {
      headers: {
        'x-apisports-key': API_KEY,
        'accept': 'application/json',
      },
    });

    const text = await upstream.text();
    res
      .status(upstream.status)
      .set('content-type', upstream.headers.get('content-type') || 'application/json')
      .send(text);

  } catch (err) {
    res.status(502).json({ ok: false, error: 'upstream_error', detail: String(err && err.message || err) });
  }
});

// TODO: Add more routes similarly, e.g. /events, /odds ...

// 6) Listen
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[GOLEX] gateway up on :${PORT}`);
});
