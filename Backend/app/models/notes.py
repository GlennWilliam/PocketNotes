import uuid
from app import db, bcrypt
from datetime import datetime, UTC

class Notes(db.Model):
	__tablename__ = 'notes'
	
	id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
	user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
	title = db.Column(db.String(255), nullable=False)
	slug = db.Column(db.String(255), nullable=False)
	content = db.Column(db.Text, nullable=False)
	status = db.Column(db.Enum('public', 'private', 'protected', name='note_status'), default='public', nullable=False)
	password_hash = db.Column(db.String(255), nullable=True)
	password_hint = db.Column(db.String(255), nullable=True)
	created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
	updated_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
	deleted_at = db.Column(db.DateTime, nullable=True)
	
	user = db.relationship("User", back_populates="notes")
	
	def set_password(self, password):
		self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
	
	def check_password(self, password):
		return bcrypt.check_password_hash(self.password_hash, password)

	def to_json(self, include_user = True):
		data = {
			"id": self.id,
			"user_id": self.user_id,
			"title": self.title,
			"slug": self.slug,
			"content": self.content,
			"status": self.status,
			"password_hint": self.password_hint,
			"created_at": self.created_at.isoformat() if self.created_at else None,
			"updated_at": self.updated_at.isoformat() if self.updated_at else None,
			"deleted_at": self.deleted_at.isoformat() if self.deleted_at else None,
		}
		
		# Include user to retrieve associated user
		if include_user and self.user:
			data["user"] = self.user.to_json()
		
		return data
		
