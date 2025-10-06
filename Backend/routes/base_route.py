from flask import blueprints, jsonify

base = blueprints.Blueprint('base', __name__)

@base.route('/', methods=['GET'])
def index():
	return jsonify({"message": "Welcome to the PocketNotes API!"})


