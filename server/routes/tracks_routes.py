from app import db
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from models import Track, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError


tracks_bp = Blueprint('track_bp', __name__, url_prefix='/tracks')

@tracks_bp.route('', methods=['GET'])
def get_tracks():
    tracks = Track.query.all()
    return jsonify([t.to_dict() for t in tracks]), 200


@tracks_bp.route('/<int:track_id>', methods=['GET'])
def get_tracks_by_id(track_id):
    track = Track.query.get(track_id)
    if not track:
        return jsonify({"error": "Track not found"}), 404

    return jsonify(track.to_dict()), 200


@tracks_bp.route('', methods=['POST'])
@jwt_required()
def create_track():
    data = request.get_json()

    if not data or "track" not in data or not data["track"].strip():
        return jsonify({"error": "Missing track text"}), 400
    
    user_id = get_jwt_identity()

    # Use .get() to safely retrieve fields and avoid KeyErrors
    new_track = Track(
        track=data['track'],
        artist=data.get('artist'), 
        genre=data.get('genre'),
        created_date=datetime.now(timezone.utc),
        user_id=user_id
    )

    db.session.add(new_track)
    db.session.commit() 

    return jsonify(new_track.to_dict()), 201

@tracks_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_track(id):
    user_id = get_jwt_identity()
    track = Track.query.get(id)

    if not track:
        return jsonify({"error": "Track not found"}), 404
    if track.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403
    
    db.session.delete(track)
    db.session.commit()
    return jsonify({"message": "Track deleted"}), 200


# Corrected update_track function
@tracks_bp.route('/<int:id>', methods=['PATCH', 'PUT'])
@jwt_required()
def update_track(id):
    user_id = get_jwt_identity()
    track = Track.query.get(id)

    if not track:
        return jsonify({"error": "Track not found"}), 404
    if track.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400    

   
    if 'track' in data:
        if not data['track'].strip():
            return jsonify({"error": "Missing track text"}), 400
        track.track = data['track']
    if 'artist' in data:
        track.artist = data['artist']
    if 'genre' in data:
        track.genre = data['genre']

    

    track.updated_date = datetime.now(timezone.utc)

    db.session.commit()

    return jsonify(track.to_dict()), 200