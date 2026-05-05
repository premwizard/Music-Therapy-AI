from flask import request

from services.music_service import infer_emotion_from_prompt, recommend_songs
from utils.api_response import success_response, error_response


def recommend_music():
    emotion = request.args.get('emotion', '').strip().lower()
    if not emotion:
        emotion = request.args.get('prompt', '').strip().lower()
        if emotion:
            emotion = infer_emotion_from_prompt(emotion)
    if not emotion:
        return error_response('emotion query param is required', status=400)

    try:
        limit = int(request.args.get('limit', 6))
    except ValueError:
        limit = 6

    songs = recommend_songs(emotion, limit=limit)
    return success_response({'emotion': emotion, 'recommendations': songs}, 'Music recommendations retrieved', status=200)
