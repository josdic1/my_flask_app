from app import create_app
from extensions import db
from models import User, Track 

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()
    print("✅ app.db reset with fresh tables!")