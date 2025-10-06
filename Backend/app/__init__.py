from flask import Flask
from .config import Config, test_db_connection
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
	app = Flask(__name__)
	app.config.from_object(Config)
	
	test_db_connection(Config)

	# Initialize extensions
	bcrypt.init_app(app)
	db.init_app(app)
	migrate.init_app(app, db)

	# Register table
	from app.models.user import User
	
	# Routing
	from app.routes.base_route import base
	app.register_blueprint(base, url_prefix='/')
	
	from app.routes.auth_route import register_bp
	app.register_blueprint(register_bp, url_prefix='/api/v1/register')

	return app