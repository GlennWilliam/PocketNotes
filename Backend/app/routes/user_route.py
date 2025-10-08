from app.services.user_service import get_user_by_id, update_user_by_id
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


@user_bp.route('/', methods=['PUT'])
@jwt_required()
def update_user():
	user_id = get_jwt_identity()
	data = request.form.to_dict()
	profile_picture = request.files.get('profile_picture')
	thumbnail_picture = request.files.get('thumbnail_picture')

	if not data and not profile_picture and not thumbnail_picture:
		return error_response("No data provided", 400)

	user, message = update_user_by_id(user_id, data, profile_picture, thumbnail_picture)

	if not user:
		return error_response(message, 400)
	
	return success_response(user, message, 200)

