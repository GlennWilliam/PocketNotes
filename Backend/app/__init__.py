from flask import Flask
from .config import Config, test_db_connection
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
	app = Flask(__name__)
	app.config.from_object(Config)
	
	test_db_connection(Config)

	# Initialize extensions
	bcrypt.init_app(app)
	db.init_app(app)
	migrate.init_app(app, db)
	jwt.init_app(app)
	
	# Register table
	from app.models.user import User
	from app.models.notes import Notes

	CORS(app, resources={
		r"/api/*": {
			"origins": [
				"http://localhost:3000",
				"http://127.0.0.1:3000"
			],
			"supports_credentials": True,
			"allow_headers": [
				"Content-Type",
				"Authorization"
			],
			"methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
		}
	})

	
	# Routing
	
	# --- TESTING PURPOSE ---
	from app.routes.base_route import base
	app.register_blueprint(base, url_prefix='/')
	
	# [POST] /api/v1/auth/login -> Login
	# [POST] /api/v1/auth/register -> Register
	from app.routes.auth_route import auth_bp
	app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
	
	# [GET] /api/v1/user/<string:user_id> -> Get user by ID
	# [PUT] /api/v1/user/<string:user_id> -> Update user by
	from app.routes.user_route import user_bp
	app.register_blueprint(user_bp, url_prefix='/api/v1/user')

	# [GET] /api/v1/uploads/<filename> -> Get uploaded file
	from app.routes.upload_route import upload_bp
	app.register_blueprint(upload_bp, url_prefix='/api/v1/uploads')
	
	# [GET] /api/v1/note/ -> Get all notes
	# [POST] /api/v1/note/ -> Create a note
	# [GET] /api/v1/note/me -> Get user's notes
	# [GET] /api/v1/note/<string:slug> -> Get note by slug
	# [PUT] /api/v1/note/<string:note_id> -> Update note by ID
	# [DELETE] /api/v1/note/<string:note_id> -> Delete note by ID
	from app.routes.note_route import note_bp
	app.register_blueprint(note_bp, url_prefix='/api/v1/note')
	
	# [POST] /api/v1/like/<string:note_id> -> Toggle like on a note
	from app.routes.like_route import like_bp
	app.register_blueprint(like_bp, url_prefix='/api/v1/like')

	

	return app