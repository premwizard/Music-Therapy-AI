from collections import Counter
from typing import Optional

from models.face_emotion import analyze_face_emotion
from models.speech_emotion import analyze_voice_emotion
from models.text_emotion import analyze_text_emotion

CANONICAL_EMOTIONS = ('happy', 'sad', 'angry', 'neutral', 'calm', 'surprised', 'disgust', 'fear')


def detect_text_emotion(text: Optional[str]) -> dict:
    emotion = analyze_text_emotion(text)
    confidence = 0.8 if emotion != 'unknown' else 0.25
    return {'emotion': emotion, 'confidence': round(confidence, 2)}


def detect_image_emotion(image_file) -> dict:
    emotion = analyze_face_emotion(image_file)
    confidence = 0.85 if emotion != 'unknown' else 0.3
    return {'emotion': emotion, 'confidence': round(confidence, 2)}


def detect_voice_emotion(audio_file) -> dict:
    emotion = analyze_voice_emotion(audio_file)
    confidence = 0.75 if emotion != 'unknown' else 0.28
    return {'emotion': emotion, 'confidence': round(confidence, 2)}


def combine_emotions(values: list[str]) -> str:
    labels = [v for v in values if v and v != 'unknown']
    if not labels:
        return 'neutral'
    counts = Counter(labels)
    top = counts.most_common(1)[0][0]
    return top
