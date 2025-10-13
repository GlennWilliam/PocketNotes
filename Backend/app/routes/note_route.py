from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response
from app.services.note_service import create_note, get_public_notes, get_user_notes, get_note_by_slug

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

@note_bp.route('/', methods=['GET'])
def get_public_notes_route():
	query_params = request.args.get('query', type=str)
	page = int(request.args.get('page', default=1, type=int))
	per_page = int(request.args.get('per_page', default=10, type=int))
	sort_by = request.args.get('sort_by', default='created_at', type=str)
	order = request.args.get('order', default='desc', type=str)
	
	notes, meta, message = get_public_notes(query_params, page, per_page, sort_by, order)

	return success_response(notes, message, 200, meta)

@note_bp.route('/me', methods=['GET'])
@jwt_required()
def get_user_notes_route():
	user_id = get_jwt_identity()
	query_params = request.args.get('query', type=str)
	page = int(request.args.get('page', default=1, type=int))
	per_page = int(request.args.get('per_page', default=10, type=int))
	sort_by = request.args.get('sort_by', default='created_at', type=str)
	order = request.args.get('order', default='desc', type=str)
	
	notes, meta, message = get_user_notes(user_id, query_params, page, per_page, sort_by, order)
	
	return success_response(notes, message, 200, meta)

@note_bp.route('/<string:slug>', methods=['GET'])
@jwt_required(optional=True)
def get_note_by_slug_route(slug):
	password = request.args.get('password', type=str) or None
	
	if password is None and request.is_json:
		body = request.get_json()
		password = body.get('password', None)
	
	user_id = get_jwt_identity()
	note, message, hint = get_note_by_slug(slug, password, user_id)
	
	if not note:
		if message in {"Password required", "Incorrect password"}:
			return error_response(message, 401, hint)
		
		return error_response(message, 404)
	
	return success_response(note, message, 200)

