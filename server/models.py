from app import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    tracks = db.relationship('Track', backref="owner", lazy=True)

    def __repr__(self):
        return f"<User {self.name}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Track(db.Model):
    __tablename__ = 'tracks'
    id = db.Column(db.Integer, primary_key=True)
    track = db.Column(db.String, nullable=False)
    artist = db.Column(db.String, nullable=True)
    genre = db.Column(db.String, nullable=True)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    links = db.relationship('TrackLink', back_populates='track', lazy=True)

    def __repr__(self):
        return f"<Track: {self.track} by {self.user_id} on {self.created_date}>"

    def to_dict(self):
        return {
            "id": self.id,
            "track": self.track,
            "artist": self.artist,
            "genre": self.genre,
            "created_date": self.created_date.isoformat() if self.created_date else None,
            "updated_date": self.updated_date.isoformat() if self.updated_date else None,
            "user_id": self.user_id,
            "links": [link.to_dict() for link in self.links]
        }
    
class TrackLink(db.Model):
    __tablename__ = 'track_links'
    id = db.Column(db.Integer, primary_key=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id', ondelete='CASCADE'), nullable=False)
    link_type = db.Column(db.String(100), nullable=False)
    link_url = db.Column(db.Text, nullable=False)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    updated_date = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))
    track = db.relationship('Track', back_populates='links', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "track_id": self.track_id,
            "link_type": self.link_type,
            "link_url": self.link_url,
            "created_date": self.created_date.isoformat() if self.created_date else None,
            "updated_date": self.updated_date.isoformat() if self.updated_date else None,
        }

    
    
