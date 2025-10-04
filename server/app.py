from flask import Flask
from flask_cors import CORS
from .extensions import db, bcrypt, jwt, migrate
from .routes.users_routes import users_bp
from .routes.tracks_routes import tracks_bp
from .routes.track_links_routes import track_links_bp
import os

def create_app():
    app = Flask(__name__)
    
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
    CORS(app, resources={r"/*": {"origins": os.getenv("FRONTEND_URL", "http://localhost:5173"), "supports_credentials": True}})
    
    # Register blueprints
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(tracks_bp, url_prefix="/tracks")
    app.register_blueprint(track_links_bp, url_prefix="/track_links")
    
    return app