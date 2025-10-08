from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token

def register_user(input_username, input_email, input_password):
	try:
		# Check if user already exists
		if User.query.filter((User.username == input_username) | (User.email == input_email)).first():
			return None, "Username or email already exists"

		# Create new user
		new_user = User(username=input_username, email=input_email)
		new_user.set_password(input_password)
		db.session.add(new_user)
		db.session.commit()
		
		user_data = {
			"username": new_user.username,
			"email": new_user.email,
			"password": new_user.password,
		}
	
		return user_data, "User registered successfully"

	except Exception as e:
		db.session.rollback()
		return None, "Error registering user: " + str(e)
	
def login_user(input_username, input_password):
	try:
		user = User.query.filter_by(username=input_username).first()
		
		# Check if user exists and password is correct
		if not user:
			return None, "User not found"
		if not user.check_password(input_password):
			return None, "Invalid password"
		
		# Generate JWT token
		token = create_access_token(identity=user.id)
		user_data = {
			"username": user.username,
			"email": user.email,
			"profile_picture": user.profile_picture,
			"thumbnail_picture": user.thumbnail_picture,
			"token": token
		}
		
		return user_data, "Login successful"
		
	except Exception as e:
		return None, "Error during login: " + str(e)


