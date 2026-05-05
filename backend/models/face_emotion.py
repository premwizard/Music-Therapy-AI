# models/face_emotion.py
import logging
from typing import Optional
logger = logging.getLogger(__name__)

_DEEPFACE_AVAILABLE = None
DeepFace = None

def _ensure_deepface():
    """Lazily import DeepFace to avoid heavy startup-time overhead."""
    global _DEEPFACE_AVAILABLE, DeepFace
    if _DEEPFACE_AVAILABLE is not None:
        return _DEEPFACE_AVAILABLE
    try:
        from deepface import DeepFace as _DF
        DeepFace = _DF
        _DEEPFACE_AVAILABLE = True
    except Exception:
        DeepFace = None
        _DEEPFACE_AVAILABLE = False
    return _DEEPFACE_AVAILABLE

# Map DeepFace emotion keys to our canonical labels
DF_TO_CANON = {
    'happy': 'happy',
    'sad': 'sad',
    'angry': 'angry',
    'neutral': 'neutral',
    'surprise': 'surprised',
    'fear': 'fear',
    'disgust': 'disgust'
}

def _map_deepface_emotions(emotion_scores: dict) -> str:
    """Pick the top emotion and map to canonical label."""
    if not emotion_scores:
        return 'unknown'
    # emotions like {'happy': 40.0, 'sad': 10.0, ...}
    top_label, top_score = max(emotion_scores.items(), key=lambda kv: kv[1])
    # If top score is extremely low, treat as neutral
    try:
        if float(top_score) < 15.0:
            return 'neutral'
    except Exception:
        pass
    return DF_TO_CANON.get(top_label, 'neutral')

def analyze_face_emotion(image_path_or_file) -> str:
    """
    Analyze face emotion. Accepts a filesystem path or a file-like object (Flask FileStorage).
    Returns canonical label or 'unknown'.
    """
    # Lazily try to import DeepFace; if not available, return 'unknown'
    try:
        if not _ensure_deepface():
            logger.debug("DeepFace not installed; face analysis unavailable.")
            return 'unknown'
    except Exception:
        logger.exception('DeepFace import check failed')
        return 'unknown'

    path_to_use = image_path_or_file
    # If file-like, write to temp file
    try:
        if hasattr(image_path_or_file, 'read') or hasattr(image_path_or_file, 'stream'):
            import tempfile
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
            data = image_path_or_file.read()
            try:
                image_path_or_file.seek(0)
            except Exception:
                pass
            tmp.write(data)
            tmp.flush()
            tmp.close()
            path_to_use = tmp.name
    except Exception:
        logger.debug("Could not write file-like image to temp file; attempting to treat input as path.")

    try:
        # Use enforce_detection=False to be tolerant of faces
        result = DeepFace.analyze(img_path=path_to_use, actions=['emotion'], enforce_detection=False)
        # result may be dict or list
        if isinstance(result, list) and len(result) > 0:
            r = result[0]
        else:
            r = result
        emotions = r.get('emotion') if isinstance(r, dict) else None
        if emotions:
            return _map_deepface_emotions(emotions)
    except Exception as e:
        logger.exception("DeepFace analysis failed: %s", e)

    return 'unknown'

if __name__ == "__main__":
    print("Face:", analyze_face_emotion("face_image.jpg"))
