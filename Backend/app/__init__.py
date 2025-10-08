from flask import Flask
from .config import Config, test_db_connection
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

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
	
	# Routing
	from app.routes.base_route import base
	app.register_blueprint(base, url_prefix='/')
	
	from app.routes.auth_route import register_bp
	app.register_blueprint(register_bp, url_prefix='/api/v1/register')
	
	from app.routes.auth_route import login_bp
	app.register_blueprint(login_bp, url_prefix='/api/v1/login')
	
	from app.routes.user_route import user_bp
	app.register_blueprint(user_bp, url_prefix='/api/v1/user')

	return app