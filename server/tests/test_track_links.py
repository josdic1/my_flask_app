import pytest
from app import create_app, db
from flask_jwt_extended import create_access_token
from models import Track, User, TrackLink 

@pytest.fixture
def app():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["JWT_SECRET_KEY"] = "test-secret"
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_header(app):
    with app.app_context():
        test_user = User(name='testuser', password='password')
        db.session.add(test_user)
        db.session.commit()
        token = create_access_token(identity=test_user.id) 
    return {"Authorization": f"Bearer {token}"}

# -------------------------
# Corrected Tests
# -------------------------

def test_create_track_link_success(client, auth_header):
    with client.application.app_context():
    
        user = User.query.filter_by(name='testuser').first()
    
        test_track = Track(track='Test Track Title', artist='Test Artist', user_id=user.id)
        db.session.add(test_track)
        db.session.commit()
        track_id = test_track.id

    response = client.post(
        "/track_links",
        json={
            "link_type": "youtube",
            "link_url": "https://www.youtube.com/watch?v=example123",
            "track_id": track_id
        },
        headers=auth_header
    )

    assert response.status_code == 201
    data = response.get_json()
    assert data['link_type'] == "youtube"
    assert data['link_url'] == "https://www.youtube.com/watch?v=example123"
    assert "id" in data
    assert "created_date" in data
    assert "updated_date" in data 
    assert data['track_id'] == track_id 

def test_create_track_link_no_data(client, auth_header):
    response = client.post(
        "/track_links",
        json={},
        headers=auth_header
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data
    assert "required fields" in data["error"].lower() 

def test_create_track_missing_token(client):
    response = client.post(
        "/tracks",
        json={"track": "Unauthorized test", "artist": "artist", "genre": "genre"}, 
        headers={}
    )
    assert response.status_code == 401
    data = response.get_json()
    assert "msg" in data

def test_create_track_link_invalid_token(client):
    with client.application.app_context():
        user = User(name='anotheruser', password='password') 
        db.session.add(user)
        db.session.commit()
        test_track = Track(track='Another Track', artist='Artist', user_id=user.id)
        db.session.add(test_track)
        db.session.commit()
        track_id = test_track.id

    response = client.post(
        "/track_links",
        json={
            "link_type": "spotify",
            "link_url": "https://spotify.com/track/invalid",
            "track_id": track_id
        },
        headers={"Authorization": "Bearer not.a.real.token"}
    )
    assert response.status_code in (401, 422) 
    data = response.get_json()
    assert "msg" in data

def test_create_track_link_empty_fields(client, auth_header):
    with client.application.app_context():
        user = User.query.filter_by(name='testuser').first()
        test_track = Track(track='Empty Test Track', artist='Empty Artist', user_id=user.id)
        db.session.add(test_track)
        db.session.commit()
        track_id = test_track.id

    response = client.post(
        "/track_links",
        json={
            "link_type": "", 
            "link_url": "",  
            "track_id": track_id
        },
        headers=auth_header
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data and ("link type cannot be empty" in data["error"].lower() or "link url cannot be empty" in data["error"].lower() or "missing required fields" in data["error"].lower()) # 
