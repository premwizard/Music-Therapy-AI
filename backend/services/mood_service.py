from datetime import datetime
from typing import List

from utils.db import get_db

_db = get_db()


def save_user_mood(user_id: str, emotion: str, notes: str | None = None, source: str | None = None) -> dict:
    payload = {
        'user_id': user_id,
        'emotion': emotion,
        'notes': notes or '',
        'source': source or 'manual',
        'created_at': datetime.utcnow(),
    }
    result = _db.moods.insert_one(payload)
    payload['_id'] = str(result.inserted_id)
    return payload


def get_mood_history(user_id: str, limit: int = 50) -> List[dict]:
    docs = list(_db.moods.find({'user_id': user_id}).sort('created_at', -1).limit(limit))
    for doc in docs:
        doc['_id'] = str(doc['_id'])
        doc['created_at'] = doc['created_at'].isoformat() if doc.get('created_at') else None
    return docs
