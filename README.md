# GOLEX Gateway (API-Football proxy)

Basit Node/Express gateway. API anahtarın **APK içinde değil**, Railway'de saklanır.

## ENV değişkenleri
- `API_FOOTBALL_KEY` (zorunlu)
- `APP_CLIENT_TOKEN` (opsiyonel — APK "x-golex-client" header'ı ile gönderebilir)
- `CORS_ORIGIN` (opsiyonel — varsayılan: `*`)
- `CACHE_TTL` (opsiyonel — saniye, varsayılan: `30`)
- `RL_WINDOW_MS` (opsiyonel — varsayılan: `60000`)
- `RL_MAX` (opsiyonel — varsayılan: `60`)

## Uçlar
- `GET /` → sağlık
- `GET /health`
- `GET /leagues`
- `GET /fixtures?date=YYYY-MM-DD&league=...&season=...`
- `GET /teams`
- `GET /standings`
- `GET /events` (fixtures/events)
- `GET /odds`

## Lokal çalıştırma
```bash
npm install
API_FOOTBALL_KEY=xxx APP_CLIENT_TOKEN=yyy node server.js
# sonra http://localhost:3000/fixtures?date=2025-10-24
```

## Railway (kısaca)
- New Project → Deploy from GitHub → Bu repo
- Variables:
  - `API_FOOTBALL_KEY = ...`
  - (ops) `APP_CLIENT_TOKEN = ...`
- Deploy → proje URL'sini BASE_URL olarak Android'e yaz.
