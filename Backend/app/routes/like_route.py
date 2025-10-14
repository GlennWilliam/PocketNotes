from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.like_service import toggle_like
from app.utils.response import success_response, error_response

like_bp = Blueprint('like_bp', __name__)

@like_bp.route('/<string:note_id>', methods=['POST'])
@jwt_required()
def toggle_like_route(note_id):
	user_id = get_jwt_identity()
	like, message = toggle_like(user_id, note_id)
	
	if not like:
		return error_response(message, 400)
	
	return success_response(like, message, 200)