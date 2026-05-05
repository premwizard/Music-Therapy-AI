from os import getenv
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / '.env')

MONGO_URI = getenv('MONGODB_URI', 'mongodb://localhost:27017')
MONGO_DBNAME = getenv('MONGODB_DB', 'music_therapy')

_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
_db = _client[MONGO_DBNAME]

# Ensure indexes exist for the core collections, but do not fail app startup if Mongo is temporarily unavailable.
try:
    _db.users.create_index('username', unique=True)
    _db.moods.create_index([('user_id', 1), ('created_at', -1)])
    _db.sessions.create_index([('user_id', 1), ('created_at', -1)])
except Exception as exc:
    import logging

    logger = logging.getLogger(__name__)
    logger.warning('MongoDB index creation failed: %s', exc)


def get_db():
    return _db


def get_collection(name: str):
    return _db[name]
