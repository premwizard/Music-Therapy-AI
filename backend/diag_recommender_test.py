"""Diagnostic script to test the music recommender module import and call."""
import os
import json

print('CWD:', os.getcwd())
print('PYTHONPATH:', os.environ.get('PYTHONPATH'))

try:
    from backend.utils.music_recommender import get_music_recommendations
    print('Imported get_music_recommendations from backend.utils')
except Exception as e:
    try:
        from utils.music_recommender import get_music_recommendations
        print('Imported get_music_recommendations from utils')
    except Exception as e2:
        print('Failed to import music_recommender:', e, e2)
        raise

print('GEMINI_API_KEY:', bool(os.getenv('GEMINI_API_KEY')))

res = get_music_recommendations('calm piano for studying', num_songs=3)
print('Result:', json.dumps(res, ensure_ascii=False, indent=2))
