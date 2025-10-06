from flask import blueprints, jsonify, request
from app.services.auth_service import register_user

register_bp = blueprints.Blueprint('register_bp', __name__)

@register_bp.route('/', methods=['POST'])
def register():
	data = request.json
	username = data.get('username')
	email = data.get('email')
	password = data.get('password')

	# Validate input
	if not username or not email or not password:
		return jsonify({"message": "Username, email, and password are required"}), 400
	
	user, message = register_user(username, email, password)
	# Check if registration was successful
	if not user:
		return jsonify({"message": message}), 400
	
	user_data = {	
		"username": user.username,
		"email": user.email,
		"created_at": user.created_at,
	}

	return jsonify({"data": user_data, "message": "Registration successful"}), 201
