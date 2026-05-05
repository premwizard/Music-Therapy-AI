# models/speech_emotion.py
import logging
from typing import Optional
logger = logging.getLogger(__name__)

_LIBROSA_LOADED = None
librosa = None
np = None

def _ensure_librosa():
    global _LIBROSA_LOADED, librosa, np
    if _LIBROSA_LOADED is not None:
        return _LIBROSA_LOADED
    try:
        import librosa as _lib
        import numpy as _np
        librosa = _lib
        np = _np
        _LIBROSA_LOADED = True
    except Exception:
        librosa = None
        np = None
        _LIBROSA_LOADED = False
    return _LIBROSA_LOADED

def _energy_and_centroid(path: str):
    """Return normalized energy and spectral centroid for heuristics, or None on failure."""
    if librosa is None or np is None:
        return None
    try:
        y, sr = librosa.load(path, sr=22050, mono=True)
        if y.size == 0:
            return None
        # Trim silence a bit
        y, _ = librosa.effects.trim(y)
        # RMS energy (frame-wise)
        rms = librosa.feature.rms(y=y)
        energy = float(np.mean(rms))
        # spectral centroid (brightness -> pitch proxy)
        cent = librosa.feature.spectral_centroid(y=y, sr=sr)
        centroid = float(np.mean(cent))
        # Normalize by typical values to make thresholds less absolute
        # energy typical range ~ 0.001 - 0.1 ; centroid typical ~ 100-5000
        return {'energy': energy, 'centroid': centroid}
    except Exception as e:
        logger.exception("Audio feature extraction failed: %s", e)
        return None

def analyze_voice_emotion(audio_path: str) -> str:
    """
    Heuristic voice emotion detection. Returns canonical label or 'unknown'.
    Possible outputs: happy, sad, angry, calm, neutral, surprised, disgust, fear, unknown
    """
    # If librosa is not available, we can't do audio features
    if not _ensure_librosa():
        logger.debug("librosa not installed; voice emotion unavailable.")
        return 'unknown'

    stats = _energy_and_centroid(audio_path)
    if not stats:
        return 'unknown'

    energy = stats['energy']
    centroid = stats['centroid']

    # heuristics:
    # - low energy -> calm/neutral
    # - high energy + high centroid -> happy/excited
    # - high energy + low centroid -> angry (low-frequency harsh)
    # - medium/low energy + low centroid -> sad
    try:
        # Choose thresholds relative to observed ranges
        # scale energy to a more interpretable range
        e = energy  # usually small
        c = centroid

        # Determine baseline categories
        if e < 0.005:
            # very low energy -> calm/possibly sleepy
            return 'calm'
        if e < 0.02:
            # low -> maybe sad or neutral depending on centroid
            if c < 1500:
                return 'sad'
            return 'neutral'
        # energetic speech
        if e >= 0.02:
            if c > 2500 and e > 0.04:
                return 'happy'
            if c < 2000 and e > 0.035:
                return 'angry'
            # energetic but not clearly high pitch -> excited/happy
            return 'happy'
    except Exception:
        logger.exception("Voice heuristics failed")

    return 'neutral'

if __name__ == "__main__":
    print("Voice:", analyze_voice_emotion("voice_sample.wav"))
