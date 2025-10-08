from app.models.user import User
from app import db

def get_user_by_id(user_id):
	user = User.query.get(user_id)
	
	if not user:
		return None, "User not found"
	
	return user.to_json(), "User retrieved successfully"