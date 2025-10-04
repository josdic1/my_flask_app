import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from server.app import create_app
from flask_migrate import upgrade

app = create_app()

if os.getenv("DEPLOY_ENV") == "render":
    with app.app_context():
        try:
            upgrade()
            print("Database upgraded automatically on startup.")
            
            # Seed if database is empty
            from server.models import User
            if User.query.count() == 0:
                print("Seeding database...")
                from server.seed import seed_data
                seed_data()
                print("Database seeded successfully.")
        except Exception as e:
            print(f"Migration/Seed failed: {e}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5555)