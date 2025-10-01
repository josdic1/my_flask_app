from app import db
from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from models import Track, User, TrackLink
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError


track_links_bp = Blueprint('track_link_bp', __name__, url_prefix='/track_links')

# READ #
@track_links_bp.route('', methods=['GET'])
def get_track_links():
    track_links = TrackLink.query.all()
    return jsonify([tl.to_dict() for tl in track_links]), 200


@track_links_bp.route('/<int:track_link_id>', methods=['GET'])
def get_track_links_by_id(track_link_id):
    track_link = TrackLink.query.get(track_link_id)
    if not track_link:
        return jsonify({"error": "TrackLink not found"}), 404
    return jsonify(track_link.to_dict()), 200

# CREATE #
@track_links_bp.route('', methods=['POST'])
@jwt_required()
def create_track_link():
    data = request.get_json()

    if not data or "link_type" not in data or not data['link_type'].strip() or "link_url" not in data or not data['link_url'].strip() or "track_id" not in data:
        return jsonify({"error": "Missing required fields or data is empty"}), 400
    
    user_id = get_jwt_identity()

    track_id = data.get('track_id')

    track = Track.query.get(track_id)
    
    if not track:
        return jsonify({"error": "Track not found"}), 404

    if track.user_id != user_id:
        return jsonify({"error": "Not authorized to add link to this track"}), 403

    new_track_link = TrackLink(
        link_type=data['link_type'],
        link_url=data['link_url'], 
        track_id=track_id
    )

    db.session.add(new_track_link)
    db.session.commit()

    return jsonify(new_track_link.to_dict()), 201

# DELETE #
@track_links_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_track_link(id):
    link_to_delete = TrackLink.query.get(id)

    if not link_to_delete:
        return jsonify({"error": "Track link not found"}), 404
    

    parent_track = Track.query.get(link_to_delete.track_id)
    user_id = get_jwt_identity()  

    if parent_track.user_id != user_id:
        return jsonify({"error": "Not authorized to delete this link"}), 403
    
    db.session.delete(link_to_delete)
    db.session.commit()
    
    return jsonify({"message": "Track link deleted"}), 200

# UPDATE #
@track_links_bp.route('/<int:id>', methods=['PATCH', 'PUT'])
@jwt_required()
def update_track_link(id):
    track_link = TrackLink.query.get(id)
    if not track_link:
        return jsonify({"error": "TrackLink not found"}), 404


    parent_track = Track.query.get(track_link.track_id)
    user_id = get_jwt_identity()
    if parent_track.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request body"}), 400    


    if 'link_type' in data:
        if not data['link_type'].strip():
            return jsonify({"error": "Link type cannot be empty"}), 400
        track_link.link_type = data['link_type']
    if 'link_url' in data:
        if not data['link_url'].strip():
            return jsonify({"error": "Link URL cannot be empty"}), 400
        track_link.link_url = data['link_url']

    track_link.updated_date = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify(track_link.to_dict()), 200