from app import db
from app.models.user import User
from app.models.notes import Notes
from sqlalchemy import asc, desc
import uuid
from datetime import datetime, UTC



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
	
def get_public_notes(query_params=None, page=1, per_page=10, sort_by='created_at', order='desc'):
	try:
		notes = Notes.query.filter(Notes.status == 'public', Notes.deleted_at == None)
		
		if query_params:
			notes = notes.filter(Notes.title.ilike(f"%{query_params}%") | Notes.content.ilike(f"%{query_params}%"))
		
		# Define what columns can be sorted
		sort_map = {
			'title': Notes.title,
			'created_at': Notes.created_at,
			'updated_at': Notes.updated_at, 
			'user': User.username
		}
		
		# Check if sort is valid. If not, default to created_at
		sort_column = sort_map.get(sort_by, Notes.created_at)
		
		if order == 'asc':
			notes = notes.order_by(asc(sort_column))
		else:
			notes = notes.order_by(desc(sort_column))
		
		# Apply pagination
		pagination = notes.paginate(page=page, per_page=per_page, error_out=False)

		notes_data = [note.to_json(include_user=True) for note in pagination.items] # Notes data in pagination

		# meta data
		meta = {
			"page": pagination.page,
			"per_page": pagination.per_page,
			"total_pages": pagination.pages,
			"total_items": pagination.total, 
			"sort_by": sort_by,
			"order": order,
			"query": query_params
		}

		return notes_data, meta, "Public notes retrieved successfully"
	except Exception as e:
		return None, None, "Error retrieving public notes: " + str(e)
	
def get_user_notes(user_id, query_params=None, page=1, per_page=10, sort_by='created_at', order='desc'):
	try:
		if not user_id:
			return None, None, "User ID is required"
		
		notes = Notes.query.filter(Notes.status == 'public', Notes.user_id == user_id, Notes.deleted_at == None)
		
		if query_params:
			notes = notes.filter(Notes.title.ilike(f"%{query_params}%") | Notes.content.ilike(f"%{query_params}%"))
		
		# Define what columns can be sorted
		sort_map = {
			'title': Notes.title,
			'created_at': Notes.created_at,
			'updated_at': Notes.updated_at, 
			'user': User.username
		}
		
		# Check if sort is valid. If not, default to created_at
		sort_column = sort_map.get(sort_by, Notes.created_at)
		
		if order == 'asc':
			notes = notes.order_by(asc(sort_column))
		else:
			notes = notes.order_by(desc(sort_column))
		
		# Apply pagination
		pagination = notes.paginate(page=page, per_page=per_page, error_out=False)

		notes_data = [note.to_json(include_user=True) for note in pagination.items] # Notes data in pagination

		# meta data
		meta = {
			"page": pagination.page,
			"per_page": pagination.per_page,
			"total_pages": pagination.pages,
			"total_items": pagination.total, 
			"sort_by": sort_by,
			"order": order,
			"query": query_params
		}

		return notes_data, meta, f"Notes {user_id} retrieved successfully"
	except Exception as e:
		return None, None, "Error retrieving public notes: " + str(e)
	
def get_note_by_slug(slug, password=None, user_id=None):
	try:
		note = Notes.query.filter(Notes.slug == slug, Notes.deleted_at == None).first()
		
		if not note:
			return None, "Note not found", None

		# If note is private, check if user_id matches
		if note.status == 'private':
			if not user_id or note.user_id != user_id:
				return None, "Access denied to private note", None
		
		# If note is protected, check password
		if note.status == 'protected':
			if not password:
				return None, "Password required", note.password_hint
			
			if not note.check_password(password):
				return None, "Incorrect password", note.password_hint
		
		return note.to_json(include_user=True), "Note retrieved successfully", None
	
	except Exception as e:
		return None, "Error retrieving note: " + str(e), None

def update_note(user_id, note_id, data):
	note = Notes.query.filter_by(id=note_id, deleted_at=None).first()
	
	if not note:
		return None, "Note not found"
	
	if note.user_id != user_id:
		return None, "Access denied to update this note"
	
	try:
		if "title" in data:
			note.title = data['title']
		if "content" in data:
			note.content = data['content']
		if "status" in data:
			status = data['status']
			
			if status not in ['public', 'private', 'protected']:
				return None, "Invalid status value"
			
			note.status = status
			
			if status == "protected":
				password = data.get('password')
				password_hint = data.get('password_hint')
				
				if not password or not password_hint:
					return None, "Password and password hint are required for protected notes"
				
				note.set_password(password)
				note.password_hint = password_hint
			else:
				note.password_hash = None
				note.password_hint = None
				
		db.session.commit()
		return note.to_json(include_user=True), "Note updated successfully"
				
	
	except Exception as e:
		db.session.rollback()
		return None, "Error updating note: " + str(e)
	

def delete_note(user_id, note_id):
	note = Notes.query.filter_by(id=note_id, deleted_at=None).first()
	
	if not note:
		return None, "Note not found"
	
	if note.user_id != user_id:
		return None, "Access denied to delete this note"
	
	try:
		note.deleted_at = datetime.now(UTC)
		db.session.commit()
		return note.to_json(include_user=True), "Note deleted successfully"
	
	except Exception as e:
		db.session.rollback()
		return None, "Error deleting note: " + str(e)
	

