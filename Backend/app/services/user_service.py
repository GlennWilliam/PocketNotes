import os, uuid
from werkzeug.utils import secure_filename
from app.models.user import User
from app import db

def get_user_by_id(user_id):
	user = User.query.get(user_id)
	
	if not user:
		return None, "User not found"
	
	return user.to_json(), "User retrieved successfully"

def update_user_by_id(user_id, data, profile_picture=None, thumbnail_picture=None):
	user = User.query.get(user_id)
	
	if not user:
		return None, "User not found"
	
	try:
		if 'password' in data and data['password']:
			user.set_password(data['password'])

		for field in ['username', 'email']:
			if field in data and data[field]:
				setattr(user, field, data[field])
		
		
		os.makedirs('uploads/', exist_ok=True)
		
		# Handle profile picture upload
		if profile_picture and is_valid_image(profile_picture.filename):
			name = random_name(profile_picture.filename)
			filename = secure_filename(name)
			path = os.path.join('uploads', filename)
			profile_picture.save(path)
			
			if user.profile_picture:
				filename_old = user.profile_picture.replace('/uploads/', '')
				path_old = os.path.join('uploads', filename_old)
				if os.path.exists(path_old):
					os.remove(path_old)
			
			setattr(user, 'profile_picture', f'/uploads/{filename}')
			

		# Handle thumbnail picture upload
		if thumbnail_picture and is_valid_image(thumbnail_picture.filename):
			name = random_name(thumbnail_picture.filename)
			filename = secure_filename(name)
			path = os.path.join('uploads', filename)
			thumbnail_picture.save(path)

			if user.thumbnail_picture:
				filename_old = user.thumbnail_picture.replace('/uploads/', '')
				path_old = os.path.join('uploads', filename_old)
				if os.path.exists(path_old):
					os.remove(path_old)

			setattr(user, 'thumbnail_picture', f'/uploads/{filename}')

		db.session.commit()
		return user.to_json(), f"User {user.username} updated successfully"

	except Exception as e:
		db.session.rollback()
		return None, "Error updating user: " + str(e)
	
def is_valid_image(filename):
	allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
	_, ext = os.path.splitext(filename.lower())
	ext = ext.lstrip('.')	
	return ext in allowed_extensions

def random_name(filename):
	# get extension of the file
	ext = os.path.splitext(filename)[1].lower()
	# generate a random name
	return f"{uuid.uuid4().hex}{ext}"