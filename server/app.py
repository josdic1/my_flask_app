from flask import Flask, send_from_directory, request
from flask_cors import CORS
from .extensions import db, bcrypt, jwt, migrate
from .routes.users_routes import users_bp
from .routes.tracks_routes import tracks_bp
from .routes.track_links_routes import track_links_bp
import os

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')
    
    # Configuration
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///instance/app.db")
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