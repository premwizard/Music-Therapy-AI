# utils/multimodal_emotion.py
"""
Multimodal emotion detection helpers.

API:
 - analyze_face_emotion(image_path_or_file) -> str
 - analyze_voice_emotion(audio_path_or_file) -> str
 - analyze_text_emotion(text) -> str
 - combine_emotions(list_of_labels, weights=None, strategy='weighted') -> str
"""
import logging
import tempfile
from typing import List, Optional, Dict

logger = logging.getLogger(__name__)

# Import the model-level analyzers (will be local modules)
try:
    from models.face_emotion import analyze_face_emotion as _face_fn
except Exception:
    _face_fn = None

try:
    from models.speech_emotion import analyze_voice_emotion as _voice_fn
except Exception:
    _voice_fn = None

try:
    from models.text_emotion import analyze_text_emotion as _text_fn
except Exception:
    _text_fn = None

CANONICAL = ('happy', 'sad', 'angry', 'neutral', 'calm', 'surprised', 'disgust', 'fear', 'unknown')

def _normalize(label: Optional[str]) -> str:
    if not label:
        return 'unknown'
    l = label.strip().lower()
    if l not in CANONICAL:
        # map common variants
        if l.startswith('joy') or 'happy' in l:
            return 'happy'
        if 'sad' in l:
            return 'sad'
        if 'angr' in l:
            return 'angry'
        if 'calm' in l or 'relax' in l:
            return 'calm'
        if 'surpris' in l:
            return 'surprised'
        if 'disgust' in l:
            return 'disgust'
        if 'fear' in l or 'scared' in l:
            return 'fear'
        if 'neutral' in l:
            return 'neutral'
        return 'neutral'
    return l

def analyze_face_emotion(image_path_or_file) -> str:
    """Wrapper that accepts a path or file-like object and returns canonical label."""
    if _face_fn is None:
        return 'unknown'
    # If file-like, write to temp file and pass path
    path = image_path_or_file
    try:
        if hasattr(image_path_or_file, 'read') or hasattr(image_path_or_file, 'stream'):
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
            data = image_path_or_file.read()
            try:
                image_path_or_file.seek(0)
            except Exception:
                pass
            tmp.write(data)
            tmp.flush()
            tmp.close()
            path = tmp.name
    except Exception:
        logger.debug("Failed to write image to temp file; attempting to use provided path")
    try:
        res = _face_fn(path)
        return _normalize(res)
    except Exception:
        logger.exception("Face analysis wrapper failed")
        return 'unknown'

def analyze_voice_emotion(audio_path_or_file) -> str:
    """Wrapper for voice. Accepts path or file-like objects."""
    if _voice_fn is None:
        return 'unknown'
    path = audio_path_or_file
    try:
        if hasattr(audio_path_or_file, 'read') or hasattr(audio_path_or_file, 'stream'):
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            data = audio_path_or_file.read()
            try:
                audio_path_or_file.seek(0)
            except Exception:
                pass
            tmp.write(data)
            tmp.flush()
            tmp.close()
            path = tmp.name
    except Exception:
        logger.debug("Failed to write audio to temp file; attempting to use provided path")
    try:
        res = _voice_fn(path)
        return _normalize(res)
    except Exception:
        logger.exception("Voice analysis wrapper failed")
        return 'unknown'

def analyze_text_emotion(text: str) -> str:
    if _text_fn is None:
        return 'unknown'
    try:
        res = _text_fn(text)
        return _normalize(res)
    except Exception:
        logger.exception("Text analysis wrapper failed")
        return 'unknown'

def combine_emotions(emotions: List[str], weights: Optional[Dict[str, float]] = None, strategy: str = 'weighted') -> str:
    """
    Combine labels into a final canonical label.

    - emotions: list of labels in order [face, audio, text] or any order
    - weights: optional mapping by index (str index) or label to float
    - strategy: 'weighted' (default) or 'majority'

    Rules:
    - Ignore 'unknown'
    - Prefer non-neutral labels when tied with neutral
    - Use weighting to prefer audio slightly (voice often more expressive) unless overridden
    """
    if not emotions:
        return 'neutral'

    # default weights if none provided: prefer audio > face > text
    default_weights = { '0': 1.0, '1': 1.2, '2': 0.9 }  # index as strings
    counts = {}
    for i, e in enumerate(emotions):
        label = (e or 'unknown').lower()
        if label == 'unknown':
            continue
        w = 1.0
        if isinstance(weights, dict):
            w = float(weights.get(str(i), weights.get(label, default_weights.get(str(i), 1.0))))
        else:
            w = float(default_weights.get(str(i), 1.0))
        counts[label] = counts.get(label, 0.0) + w

    if not counts:
        return 'neutral'

    # If strategy majority, collapse to simple counts ignoring weights
    if strategy == 'majority':
        maj = {}
        for i, e in enumerate(emotions):
            if not e or e == 'unknown': continue
            lab = e
            maj[lab] = maj.get(lab, 0) + 1
        if maj:
            # tie-breaker prefer non-neutral
            best_label = max(maj.items(), key=lambda kv: (kv[1], 0 if kv[0]=='neutral' else 1))[0]
            return best_label

    # Weighted selection: prefer the label with max weighted score.
    final = max(counts.items(), key=lambda kv: (kv[1], 0 if kv[0]=='neutral' else 1))[0]

    # If final is neutral but there exists another label with nearly equal weight, choose non-neutral
    if final == 'neutral':
        # find top non-neutral
        non_neutral = {k:v for k,v in counts.items() if k != 'neutral'}
        if non_neutral:
            top_non = max(non_neutral.items(), key=lambda kv: kv[1])
            # if close enough (>= 50% of neutral score), prefer it
            if top_non[1] >= 0.5 * counts.get('neutral', 0.0):
                return top_non[0]
    return final

if __name__ == "__main__":
    # quick local test simulation
    print(combine_emotions(['sad', 'sad', 'unknown']))
    print(combine_emotions(['neutral', 'sad', 'neutral']))
    print(combine_emotions(['neutral', 'neutral', 'neutral']))
