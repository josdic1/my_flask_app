from flask import Flask, jsonify
from flask_cors import CORS
from extensions import db, bcrypt, jwt
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    # Load .env
    load_dotenv()
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback-secret")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback-jwt-secret")

    
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