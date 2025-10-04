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
    
    # Serve React app - catch-all for client-side routing
    @app.errorhandler(404)
    def not_found(e):
        # If it's an API request that actually 404'd, return JSON
        if request.path.startswith('/users') or request.path.startswith('/tracks') or request.path.startswith('/track_links'):
            return {"error": "Not found"}, 404
        # Otherwise serve index.html for React Router
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        # Serve static files if they exist
        if path and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        # Let React Router handle it
        return send_from_directory(app.static_folder, 'index.html')
    
    return app