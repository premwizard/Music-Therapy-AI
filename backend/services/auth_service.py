import bcrypt
from datetime import datetime
from utils.db import get_db

_db = get_db()


def get_user_by_username(username: str) -> dict | None:
    return _db.users.find_one({'username': username})


def register_user(username: str, password: str, meta: dict | None = None) -> bool:
    if get_user_by_username(username):
        return False
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_doc = {
        'username': username,
        'password_hash': password_hash,
        'meta': meta or {},
        'created_at': datetime.utcnow(),
    }
    _db.users.insert_one(user_doc)
    return True


def verify_credentials(username: str, password: str) -> bool:
    user = get_user_by_username(username)
    if not user or not user.get('password_hash'):
        return False
    return bcrypt.checkpw(password.encode('utf-8'), user['password_hash'])


def update_user_meta(username: str, meta: dict) -> bool:
    result = _db.users.update_one({'username': username}, {'$set': {'meta': meta}})
    return result.matched_count > 0
