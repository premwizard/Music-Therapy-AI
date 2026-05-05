from flask import request

from services.mood_service import save_user_mood, get_mood_history
from utils.api_response import success_response, error_response
from utils.security import auth_required


@auth_required
def save_mood():
    user = request.current_user
    data = request.get_json(silent=True) or {}
    emotion = data.get('emotion')
    if not emotion:
        return error_response('emotion is required', status=400)

    notes = data.get('notes')
    source = data.get('source') or 'manual'
    saved = save_user_mood(user['username'], emotion, notes=notes, source=source)
    return success_response(saved, 'Mood saved', status=201)


@auth_required
def mood_history():
    user = request.current_user
    try:
        limit = int(request.args.get('limit', 50))
    except ValueError:
        limit = 50
    history = get_mood_history(user['username'], limit=limit)
    return success_response({'history': history}, 'Mood history retrieved', status=200)
