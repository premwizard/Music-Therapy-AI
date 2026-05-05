# models/text_emotion.py
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Canonical labels we use across the app
CANONICAL = ('happy', 'sad', 'angry', 'neutral', 'calm', 'surprised', 'disgust', 'fear')

def _map_to_canonical(label: str) -> str:
    if not label:
        return 'unknown'
    l = label.strip().lower()
    if l.startswith('joy') or 'happy' in l or 'glad' in l or 'excited' in l or 'love' in l:
        return 'happy'
    if 'sad' in l or 'depress' in l or 'unhappy' in l or 'sorrow' in l or 'cry' in l:
        return 'sad'
    if 'angr' in l or 'mad' in l or 'furious' in l or 'irritat' in l:
        return 'angry'
    if 'calm' in l or 'relax' in l or 'peace' in l or 'quiet' in l or 'serene' in l:
        return 'calm'
    if 'surpris' in l or 'wow' in l or 'astonish' in l:
        return 'surprised'
    if 'disgust' in l or 'gross' in l:
        return 'disgust'
    if 'fear' in l or 'scared' in l or 'terrify' in l or 'anx' in l:
        return 'fear'
    if 'neutral' in l or l.strip() == '':
        return 'neutral'
    # default heuristic
    # treat short exclamations as surprised/happy
    if len(l) < 6 and (l.endswith('!') or '!' in l):
        return 'surprised'
    return 'neutral'

def analyze_text_emotion(text: Optional[str]) -> str:
    """
    Lightweight text emotion classifier.

    Returns one of: happy, sad, angry, neutral, calm, surprised, disgust, fear, unknown
    """
    try:
        if not text:
            return 'unknown'
        t = text.strip()
        # quick positive/negative word heuristics
        t_low = t.lower()
        # explicit checks first
        mapped = _map_to_canonical(t_low)
        return mapped
    except Exception as e:
        logger.exception("Text emotion analysis failed: %s", e)
        return 'unknown'

if __name__ == "__main__":
    print(analyze_text_emotion("I feel so happy and excited today!"))
    print(analyze_text_emotion("I'm really sad and depressed."))
