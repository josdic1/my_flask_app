#!/usr/bin/env bash
set -euo pipefail

# Run DB migrations (only does anything if alembic/migrations exist)
# DEPLOY_ENV=render can be used by app logic if needed
export DEPLOY_ENV=${DEPLOY_ENV:-render}

echo "[start] Creating app and running migrations (if any)"
if [ "$DEPLOY_ENV" = "render" ]; then
	if [ -z "${DATABASE_URL:-}" ]; then
		echo "[error] DEPLOY_ENV=render requires DATABASE_URL to be set. Aborting startup."
		exit 1
	fi
fi

python3 -c "import sys,os; sys.path.append(os.path.abspath(os.getcwd())); from server.app import create_app; from flask_migrate import upgrade; app=create_app(); ctx=app.app_context(); ctx.push(); upgrade(); ctx.pop(); print('MIGRATIONS_OK')"

echo "[start] Starting gunicorn"
# Bind to Render's $PORT, fallback to 10000
PORT=${PORT:-10000}
# Respect WEB_CONCURRENCY if set, otherwise default to 2 workers
WEB_CONCURRENCY=${WEB_CONCURRENCY:-2}
exec gunicorn server.run:app -b 0.0.0.0:${PORT} --workers ${WEB_CONCURRENCY} --log-level info
