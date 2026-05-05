from flask import request

from services.ai_service import create_therapy_response
from utils.api_response import success_response, error_response


def therapy():
    data = request.get_json(silent=True) or {}
    emotion = data.get('emotion')
    message = data.get('message')
    if not emotion or not message:
        return error_response('emotion and message are required', status=400)

    result = create_therapy_response(emotion, message)
    return success_response(result, 'Therapy response generated', status=200)
