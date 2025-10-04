# my_flask_app
# trigger

## Deploying to Render

Recommended environment variables (set these in Render service settings):

- `DATABASE_URL` — your Postgres connection string (required for production deploys)
- `SECRET_KEY` — Flask secret key (set a strong value)
- `JWT_SECRET_KEY` — JWT secret key for authentication
- `DEPLOY_ENV` — set to `render` (the start script defaults this)
- `WEB_CONCURRENCY` — optional, number of gunicorn workers (default: 2)

Build command (Render web service > Build Command):

```bash
python3 -m pip install -r requirements.txt
cd client
npm ci
npm run build
```

Start command (Render web service > Start Command):

```bash
bin/start.sh
```

Notes:
- The client build outputs into `server/static` (configured in `client/vite.config.js`).
- `bin/start.sh` runs Alembic migrations and then starts gunicorn; it will abort if `DEPLOY_ENV=render` and `DATABASE_URL` is not set.
- Alternatively, you can use a single-line start command that runs migrations and then starts gunicorn (see repo for examples).

Health and readiness endpoints
------------------------------

- `GET /health` - returns 200 with {"status": "ok"} when the app is running.
- `GET /ready` - performs a lightweight DB check; returns 200 when DB is reachable, 503 otherwise. This path is configured as Render's `healthCheckPath` in `render.yaml`.
