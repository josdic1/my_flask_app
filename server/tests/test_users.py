import pytest
from app import create_app, db
from models import User
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["JWT_SECRET_KEY"] = "test_secret"

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

@pytest.fixture
def auth_header(client):
    """Creates a user and returns a valid JWT auth header."""
    # Create a user in the database
    with client.application.app_context():
        test_user = User(name='test_user', password='hashed_password')
        db.session.add(test_user)
        db.session.commit()
        # Create a token for the user's id
        token = create_access_token(identity=test_user.id)
    return {'Authorization': f"Bearer {token}"}

# -------------------------
# Corrected Tests
# -------------------------

def test_create_user_success(client):
    response = client.post(
        "/users",
        json={"name": "tester", "password": "secret123"},
        headers={}
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == "tester"
    assert "password" not in data
    assert "id" in data and isinstance(data["id"], int)


def test_create_user_empty_name_text(client):
    response = client.post(
        "/users",
        json={"name" : "", "password": "secret123"}, 
        headers={}
     )
    assert response.status_code == 400
    data = response.get_json()
    assert "error" in data and data["error"]


def test_user_login_success(client):
    response = client.post(
        "/users",
        json={"name" : "tester", "password": "secret123"},
        headers={}
    )
    assert response.status_code == 201

    response = client.post(
        "/users/login",
        json={"name" : "tester", "password": "secret123"},
        headers={}
    )
    assert response.status_code == 200
    data = response.get_json()

    assert "access_token" in data
    assert data["message"] == "Login successful"
    assert data["user"]["name"] == "tester"

    token = data["access_token"]
    assert isinstance(token, str) and len(token) > 10

    response = client.get(
         "/users/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    profile = response.get_json()
    assert profile["name"] == "tester"