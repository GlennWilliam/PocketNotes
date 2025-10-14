import uuid
from app import db, bcrypt
from datetime import datetime, UTC

class User(db.Model):
	__tablename__ = 'user'
	
	# Define the columns for the users table
	id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
	username = db.Column(db.String(50), unique=True, nullable=False)	
	email = db.Column(db.String(50), unique=True, nullable=False)
	password = db.Column(db.String(255), nullable=False)
	profile_picture = db.Column(db.String(255), nullable=True)
	thumbnail_picture = db.Column(db.String(255), nullable=True)
	created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
	updated_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
	
	# Relationship to notes
	notes = db.relationship("Notes", back_populates="user", lazy=True)
	
	# Relationship to likes
	likes = db.relationship("Like", backref="user", lazy=True)
	
	# Password hashing methods
	def set_password(self, password):
		self.password = bcrypt.generate_password_hash(password).decode('utf-8')
	
	def check_password(self, password):
		return bcrypt.check_password_hash(self.password, password)
	
	def to_json(self, include_notes = True, include_likes = False):
		data = {
			"id": self.id,
			"username": self.username,
			"email": self.email,
			"profile_picture": self.profile_picture,
			"thumbnail_picture": self.thumbnail_picture,
			"created_at": self.created_at.isoformat(),
		}
		
		# Include notes to retrieve associated notes
		if include_notes:
			data["notes"] = [note.to_json(include_user=False) for note in self.notes]
		
		# Include likes to retrieve associated likes
		if include_likes:
			data["likes"] = [like.to_json(include_user=False, include_note=False) for like in self.likes]
			
		return data
	
	
