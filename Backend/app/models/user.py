import uuid
from app import db, bcrypt
from datetime import datetime, UTC

class User(db.Model):
	__name__ = 'user'
	
	# Define the columns for the users table
	id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
	username = db.Column(db.String(50), unique=True, nullable=False)	
	email = db.Column(db.String(50), unique=True, nullable=False)
	password = db.Column(db.String(255), nullable=False)
	profile_picture = db.Column(db.String(255), nullable=True)
	thumbnail_picture = db.Column(db.String(255), nullable=True)
	created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
	updated_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
	
	# Password hashing methods
	def set_password(self, password):
		self.password = bcrypt.generate_password_hash(password).decode('utf-8')
	
	def check_password(self, password):
		return bcrypt.check_password_hash(self.password, password)
	
	
