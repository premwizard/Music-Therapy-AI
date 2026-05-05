import json
import random
from pathlib import Path
from typing import List

SONG_CATALOG_PATH = Path(__file__).resolve().parent.parent / 'data' / 'song_catalog.json'

EMOTION_TAG_MAP = {
    'happy': ['happy', 'upbeat', 'dance', 'pop', 'energetic'],
    'sad': ['sad', 'melancholic', 'slow', 'indie'],
    'angry': ['energetic', 'rock', 'power', 'funk'],
    'calm': ['calm', 'piano', 'ambient', 'relax', 'study'],
    'neutral': ['instrumental', 'calm', 'study', 'ambient'],
    'surprised': ['upbeat', 'pop', 'dance', 'energetic'],
    'disgust': ['ambient', 'calm', 'neutral'],
    'fear': ['calm', 'ambient', 'soft'],
}


def _load_catalog() -> List[dict]:
    try:
        with open(SONG_CATALOG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []


CATALOG = _load_catalog()


def recommend_songs(emotion: str, limit: int = 6) -> List[dict]:
    tags = EMOTION_TAG_MAP.get(emotion, EMOTION_TAG_MAP['neutral'])
    matched = [song for song in CATALOG if any(tag in song.get('tags', '').split() for tag in tags)]
    if not matched:
        matched = CATALOG.copy()
    random.shuffle(matched)
    return matched[:limit]


def infer_emotion_from_prompt(prompt: str) -> str:
    if not prompt:
        return 'neutral'
    lower = prompt.lower()
    for emotion, keywords in EMOTION_TAG_MAP.items():
        if any(word in lower for word in keywords):
            return emotion
    return 'neutral'
