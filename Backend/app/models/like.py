import uuid
from datetime import datetime, UTC
from app import db

class Like(db.Model):
	__tablename__ = 'likes'
	
	id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
	user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
	note_id = db.Column(db.String(36), db.ForeignKey('notes.id'), nullable=False)
	created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
	updated_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
	
	# Relationship to user
	user = db.relationship("User", back_populates="likes") 
	
	# Relationship to notes
	note = db.relationship("Notes", back_populates="likes")
	
	def to_json(self, include_user = False, include_notes = False):
		data = {
			"id": self.id,
			"user_id": self.user_id,
			"note_id": self.note_id
		}
		
		if include_user and self.user:
			data["user"] = {
				"username": self.user.username,
				"email": self.user.email,
			}
		
		if include_notes and self.note:
			data["note"] = {
				"title": self.note.title,
				"content": self.note.content,
				"status": self.note.status,
			}
		
		return data