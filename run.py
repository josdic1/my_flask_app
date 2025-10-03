from server.app import create_app
from flask_migrate import upgrade
import os

app = create_app()

# Only auto-upgrade when DEPLOY_ENV=render
if os.getenv("DEPLOY_ENV") == "render":
    with app.app_context():
        try:
            upgrade()
            print("✅ Database upgraded automatically on startup.")
        except Exception as e:
            print(f"❌ Migration failed: {e}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5555)
