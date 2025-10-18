from email import message
from flask import blueprints, jsonify, request
from app.services.auth_service import register_user
from app.services.auth_service import login_user

auth_bp = blueprints.Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
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
	
	return jsonify({"data": user, "message": "Registration successful"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
	data = request.json
	username = data.get('username')
	password = data.get('password')
	
	# Validate input
	if not username or not password:
		return jsonify({"message": "Username and password are required"}), 400
	
	user, message = login_user(username, password)
	
	# Check if login was successful
	if not user:
		return jsonify({"message": message}), 401

	return jsonify({"data": user, "message": "Login successful"}), 200
