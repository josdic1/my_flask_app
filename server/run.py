import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.app import create_app
from flask_migrate import upgrade

app = create_app()


def run_migrations_if_render(application):
    """Run Alembic upgrade when explicitly desired (not at import time).

    Avoid running migrations during module import because Gunicorn imports the module
    to retrieve the WSGI `app` callable. Instead, run migrations as a separate start step
    (see README / deployment start command) or when executing this script directly.
    """
    if os.getenv("DEPLOY_ENV") == "render":
        with application.app_context():
            try:
                upgrade()
                print("\u2705 Database upgraded automatically on startup.")
            except Exception as e:
                print(f"\u274c Migration failed: {e}")


if __name__ == "__main__":
    # When running locally with `python server/run.py`, run migrations (if applicable)
    # then start the dev server. In production (gunicorn import) we avoid running
    # migrations during import.
    run_migrations_if_render(app)
    app.run(debug=True, host="0.0.0.0", port=5555)