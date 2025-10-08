from app.services.user_service import get_user_by_id
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_user():
	user_id = get_jwt_identity()
	user, message = get_user_by_id(user_id)
	
	if not user:
		return error_response(message, 404)

	return success_response(user, message, 200)	

