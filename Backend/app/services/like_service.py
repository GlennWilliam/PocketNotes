from app.models.like import Like
from app.models.notes import Notes
from app.models.user import User
from app import db

def toggle_like(user_id, note_id):
	user = User.query.get(user_id)
	if not user:
		return None, "User not found"
	
	note = Notes.query.get(note_id)
	if not note:
		return None, "Note not found"
	
	like = Like.query.filter(Like.user_id == user_id, Like.note_id == note_id).first()
	if like:
		try:
			db.session.delete(like)
			db.session.commit()
			return True, "Like removed"
		except Exception as e:
			db.session.rollback()
			return None, "Error removing like: " + str(e)
	else:
		try:
			new_like = Like(user_id=user_id, note_id=note_id)
			db.session.add(new_like)
			db.session.commit()
			return True, "Like added"
		except Exception as e:
			db.session.rollback()
			return None, "Error adding like: " + str(e)