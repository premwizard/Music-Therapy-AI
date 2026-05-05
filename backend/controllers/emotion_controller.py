from flask import request

from services.emotion_service import (
    detect_text_emotion,
    detect_image_emotion,
    detect_voice_emotion,
    combine_emotions,
)
from utils.api_response import success_response, error_response


def detect_text():
    data = request.get_json(silent=True) or {}
    text = data.get('text')
    if text is None:
        return error_response('Missing text field', status=400)
    result = detect_text_emotion(text)
    return success_response(result, 'Text emotion detected', status=200)


def detect_image():
    if 'image' not in request.files:
        return error_response('Missing image file', status=400)
    image = request.files['image']
    result = detect_image_emotion(image)
    return success_response(result, 'Image emotion detected', status=200)


def detect_voice():
    if 'audio' not in request.files:
        return error_response('Missing audio file', status=400)
    audio = request.files['audio']
    result = detect_voice_emotion(audio)
    return success_response(result, 'Voice emotion detected', status=200)


def detect_multimodal():
    text = None
    if request.content_type and 'application/json' in request.content_type:
        data = request.get_json(silent=True) or {}
        text = data.get('text')
    else:
        text = request.form.get('text')

    results = {}
    if 'image' in request.files:
        results['image'] = detect_image_emotion(request.files['image'])
    if 'audio' in request.files:
        results['audio'] = detect_voice_emotion(request.files['audio'])
    if text is not None:
        results['text'] = detect_text_emotion(text)

    emotions = [entry['emotion'] for entry in results.values() if entry.get('emotion')]
    results['combined'] = combine_emotions(emotions) if emotions else 'neutral'
    return success_response(results, 'Multimodal emotion detected', status=200)
