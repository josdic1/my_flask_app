from flask import Flask, send_from_directory, request
from flask_cors import CORS
from .extensions import db, bcrypt, jwt, migrate
from .routes.users_routes import users_bp
from .routes.tracks_routes import tracks_bp
from .routes.track_links_routes import track_links_bp
import os

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')
    
    # Ensure instance folder exists (Flask uses this for instance-specific files)
    try:
        os.makedirs(app.instance_path, exist_ok=True)
    except Exception:
        # If we can't create the folder here, let the DB error surface later with clearer context
        pass

    # Configuration
    # Prefer DATABASE_URL from env; fall back to an absolute sqlite file in the instance folder so
    # Alembic (which may change working directories) can still open the DB file.
    default_sqlite_path = os.path.join(app.instance_path, 'app.db')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", f"sqlite:///{default_sqlite_path}")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "super-secret-key")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-jwt-secret")
    
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*", "supports_credentials": True}})
    
    # Register blueprints
    app.register_blueprint(users_bp)
    app.register_blueprint(tracks_bp)
    app.register_blueprint(track_links_bp)
    
    # Serve React app for root
    @app.route('/')
    def index():
        return send_from_directory(app.static_folder, 'index.html')
    
    # Handle all 404s - serve React for non-API routes, JSON error for API routes

    # Health check - basic
    @app.route('/health')
    def health():
        return {"status": "ok"}, 200

    # Readiness check - ensure database connectivity
    @app.route('/ready')
    def ready():
        try:
            # lightweight DB call
            from sqlalchemy import text
            with app.app_context():
                # Use SQLAlchemy to execute a simple statement
                db.session.execute(text('SELECT 1'))
            return {"ready": True}, 200
        except Exception:
            return {"ready": False}, 503
    return app