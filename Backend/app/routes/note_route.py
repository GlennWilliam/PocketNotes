from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response
from app.services.note_service import create_note

note_bp = Blueprint('note_bp', __name__)

@note_bp.route('/', methods=['POST'])
@jwt_required()
def create_note_route():
	user_id = get_jwt_identity()
	data = request.get_json()
	
	if not data:
		return error_response("No data provided", 400)
	
	password = data.get('password') or None
	password_hint = data.get('password_hint') or None

	note, message = create_note(user_id, data['title'], data['content'], data['status'], password, password_hint)
	
	if not note:
		return error_response(message, 400)
	return success_response(note, message, 201)
	
