import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

load_dotenv()

def mysql_config():
	user = os.getenv("DB_USER", "root")
	password = os.getenv("DB_PASSWORD", "")
	host = os.getenv("DB_HOST", "localhost")
	port = int(os.getenv("DB_PORT", 3306))
	database = os.getenv("DB_NAME", "PocketNotes")
	
	return(f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}")

class Config:
	SQLALCHEMY_DATABASE_URI = mysql_config()
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "123")

def test_db_connection(config):
	try:
		engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
		connection = engine.connect()
		connection.close()
		print("Database connection successful.")
		return True
	except OperationalError as e:
		print(f"Database connection error: {e}")
		return False
