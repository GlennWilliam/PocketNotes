import uuid
from app import db, bcrypt
from datetime import datetime, UTC
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import func, select
from app.models.like import Like

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
	
	# Relationship to user
	user = db.relationship("User", back_populates="notes")
	
	# Relationship to likes
	likes = db.relationship("Like", back_populates="note", lazy=True)
	
	def set_password(self, password):
		self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
	
	def check_password(self, password):
		return bcrypt.check_password_hash(self.password_hash, password)
	
	@hybrid_property
	def like_count(self):
		return len(self.likes)
	
	@like_count.expression
	def like_count(cls):
		return select([func.count(Like.id)]).where(Like.note_id == cls.id).label("like_count")

	def to_json(self, include_user = True, include_likes = False):
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
			"like_count": self.like_count
		}
		
		# Include user to retrieve associated user
		if include_user and self.user:
			data["user"] = self.user.to_json(include_notes=False, include_likes=False)
			
		# Include likes to retrieve associated likes
		if include_likes:
			data["likes"] = [like.to_json(include_user=True, include_notes=False) for like in self.likes]

		return data
		
