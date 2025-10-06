from flask import Flask
from .config import Config, test_db_connection

def create_app():
	app = Flask(__name__)
	app.config.from_object(Config)
	
	test_db_connection(Config)
	return app