import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# MySQL configuration from environment or defaults
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DATABASE", "campus_teams_db")

# Constructed MySQL URI
if MYSQL_PASSWORD:
    mysql_uri = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
else:
    mysql_uri = f"mysql+pymysql://{MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

# Check for custom explicit DATABASE_URL
database_url = os.getenv("DATABASE_URL", mysql_uri)

engine = None
active_db_type = "MySQL"

# Try connecting to MySQL; if unavailable, seamlessly fall back to SQLite
try:
    test_engine = create_engine(database_url, echo=False, pool_pre_ping=True)
    with test_engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    engine = test_engine
    active_db_type = "MySQL"
    print(f"Connected successfully to MySQL database: {MYSQL_DB} at {MYSQL_HOST}")
except Exception as e:
    sqlite_path = os.path.join(os.path.dirname(__file__), "campus_teams.db")
    engine = create_engine(f"sqlite:///{sqlite_path}", echo=False)
    active_db_type = "SQLite (Fallback - MySQL not connected)"
    print(f"MySQL connection failed ({e}). Falling back to local SQLite database: {sqlite_path}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

