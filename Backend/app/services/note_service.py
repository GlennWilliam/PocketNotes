from app import db
from app.models.user import User
from app.models.notes import Notes
import uuid

def create_note(user_id, title, content, status='public', password=None, password_hint=None):
	try:
		# Check if user exists
		user = User.query.get(user_id)
		if not user:
			return None, "User not found"

		# Check for required fields
		if not title or not content:
			return None, "Title and content are required"

		if status not in ['public', 'private', 'protected']:
			return None, "Invalid status value"
		
		if status == "protected" and not password:
			return None, "Password is required for protected notes"
		
		# Generate slug from title
		slug = str(uuid.uuid4())
		
		
		# Create new note
		new_note = Notes(
			user_id=user_id,
			title=title,
			content=content,
			status=status,
			slug=slug,
			password_hint=(password_hint or None)
		)
		
		if status == "protected" and password:
			new_note.set_password(password)
		
		db.session.add(new_note)
		db.session.commit()
		
		return new_note.to_json(), "Note created successfully"
	
	except Exception as e:
		db.session.rollback()
		return None, "Error creating note: " + str(e)

