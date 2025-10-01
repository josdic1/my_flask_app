import pytest
from app import create_app, db
from flask_jwt_extended import create_access_token

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
        token = create_access_token(identity=1)
    return {"Authorization": f"Bearer {token}"}

# -------------------------
# Tests
# -------------------------

def test_create_track_success(client, auth_header):
    response = client.post(
        "/tracks",
        json={"track": "Hello World"},
        headers=auth_header
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['track'] == "Hello World"
    assert "id" in data

def test_create_track_missing_token(client):
    response = client.post(
        "/tracks",
        json={"track": "Unauthorized test"},
        headers={}
    )
    assert response.status_code == 401
    data = response.get_json()
    assert "msg" in data

def test_create_track_invalid_token(client):
    response = client.post(
        "/tracks",
        json={"track": "Invalid token test"},
        headers={"Authorization": "Bearer not.a.real.token"}
    )
    assert response.status_code in (401, 422)
    data = response.get_json()
    assert "msg" in data

def test_create_track_no_text_field(client, auth_header):
    response = client.post(
        "/tracks",
        json={},
        headers=auth_header
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data and data["error"]

def test_create_track_empty_string(client, auth_header):
    response = client.post(
        "/tracks",
        json={"track": ""},
        headers=auth_header
    )
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data and data["error"]