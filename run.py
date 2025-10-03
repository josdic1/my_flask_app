from server.app import create_app 
from flask_migrate import upgrade

app = create_app()

# Run migrations automatically at startup
with app.app_context():
    try:
        upgrade()
        print("Database upgraded automatically on startup.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5555)