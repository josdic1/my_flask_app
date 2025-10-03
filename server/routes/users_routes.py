from flask import Blueprint, request, jsonify
from ..models import User
from ..extensions import db, bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

users_bp = Blueprint('user_bp', __name__, url_prefix='/users')

@users_bp.route('', methods=['GET'])
def get_users():
    users = User.query.all() 
    return jsonify([u.to_dict() for u in users]), 200

@users_bp.route('/<int:id>', methods=['GET'])
def get_user_by_id(id):
    user = User.query.get(id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.to_dict()), 200

# Create user #

@users_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400
    if 'name' not in data or not data['name'].strip():

        return jsonify({"error": "Missing or empty field: name"}), 400
    if 'password' not in data:
        return jsonify({"error": "Missing field: password"}), 400

    hashed_password = bcrypt.generate_password_hash(
        data['password']
    ).decode('utf-8')

    new_user = User(
        name=data['name'],
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201


# Login #
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing request body"}), 400    
    if 'name' not in data:
        return jsonify({"error": "Missing field: name"}), 400
    if 'password' not in data:
        return jsonify({"error": "Missing field: password"}), 400
    
    user = User.query.filter_by(name=data['name']).first()

    if not user:
        return jsonify({'error': 'No user found'}), 401
    
    if not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "message": "Login successful",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200

# Refresh token #

@users_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "Could not find user profile"}), 404
    
    return jsonify(user.to_dict()), 200

@users_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    # Get the ID from the JWT token
    current_user_id = get_jwt_identity()

    # Check if the user ID from the URL matches the token ID
    if int(id) != current_user_id:
        return jsonify({"error": "You can only delete your own profile"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"}), 200


@users_bp.route('/<int:id>', methods=['PATCH', 'PUT'])
@jwt_required()
def update_user(id):
    # Get the ID from the JWT token
    current_user_id = get_jwt_identity()
    
    # Check if the user ID from the URL matches the token ID
    if int(id) != current_user_id:
        return jsonify({"error": "You can only update your own profile"}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Missing request body"}), 400

    # Only allow a name update
    if 'name' in data:
        user.name = data['name']
    
    # Example: Allow a password update
    if 'password' in data:
        # Re-hash the new password before saving it
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user.password = hashed_password

    db.session.commit()
    return jsonify(user.to_dict()), 200