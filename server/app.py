from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db, bcrypt, jwt
from dotenv import load_dotenv
from datetime import timedelta
import os

def create_app():
    app = Flask(__name__)
    CORS(app, resources={
        r"/*": {
            "origins": "http://localhost:5173",
            "supports_credentials": True,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE"]
        }
    })

    # Load .env
    load_dotenv()
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback-secret")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-jwt-secret")

    # Token lifetimes (explicit)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

    # Database + extensions
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from models import User, Track, TrackLink
    from routes.tracks_routes import tracks_bp
    from routes.users_routes import users_bp
    from routes.track_links_routes import track_links_bp
    app.register_blueprint(tracks_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(track_links_bp)

    return app
