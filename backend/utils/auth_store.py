import json
import os
import threading
from typing import Dict, Any

_LOCK = threading.Lock()
_USERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'users.json')


def _load_users() -> Dict[str, Any]:
    path = os.path.abspath(_USERS_FILE)
    if not os.path.exists(path):
        return {}
    with _LOCK:
        with open(path, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except Exception:
                return {}


def _save_users(users: Dict[str, Any]):
    path = os.path.abspath(_USERS_FILE)
    with _LOCK:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)


def get_user(username: str):
    users = _load_users()
    return users.get(username)


def create_user(username: str, hashed_password: str, metadata: Dict[str, Any] = None) -> bool:
    users = _load_users()
    if username in users:
        return False
    users[username] = {'password': hashed_password, 'meta': metadata or {}}
    _save_users(users)
    return True


def verify_user(username: str, hashed_password: str) -> bool:
    users = _load_users()
    entry = users.get(username)
    if not entry:
        return False
    return entry.get('password') == hashed_password


def update_user_meta(username: str, metadata: Dict[str, Any]) -> bool:
    """Update or replace the metadata for a user. Returns True on success."""
    users = _load_users()
    if username not in users:
        return False
    users[username]['meta'] = metadata or {}
    _save_users(users)
    return True
