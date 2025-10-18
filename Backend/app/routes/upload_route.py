import os
from flask import current_app, blueprints, abort, send_from_directory
from werkzeug.utils import secure_filename

upload_bp = blueprints.Blueprint('upload_bp', __name__)

@upload_bp.route('/<filename>', methods=['GET'])
def get_upload(filename):
	safe_filename = secure_filename(filename)

	# Find the upload folder
	path = current_app.config.get('UPLOAD_FOLDER', os.path.join(os.getcwd(), 'uploads'))
	
	# Find the file
	file_path = os.path.join(path, safe_filename)
	
	if not os.path.exists(file_path):
		abort(404, description="File not found")
		
	return send_from_directory(path, safe_filename)