# utils/music_recommender.py
import os
import logging
import json
import time
from pathlib import Path
from typing import List, Dict, Optional
import random

logger = logging.getLogger(__name__)
if not logger.handlers:
    # basic configuration when imported directly for simple runs
    handler = logging.StreamHandler()
    fmt = logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s')
    handler.setFormatter(fmt)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

# Try to import optional dependencies
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel
    SKLEARN_AVAILABLE = True
except Exception:
    SKLEARN_AVAILABLE = False

# Try to import gemini helper if present
try:
    from .gemini_client import get_gemini_model
except Exception:
    try:
        from utils.gemini_client import get_gemini_model
    except Exception:
        get_gemini_model = None

# Simple mood -> song lists (distinct per mood)
MOOD_MAP = {
    'happy': [
        "Pharrell Williams - Happy",
        "Katy Perry - Firework",
        "Bruno Mars - Uptown Funk",
        "ABBA - Dancing Queen",
        "Daft Punk - Get Lucky",
        "Mark Ronson - Uptown Funk",
        "Justin Timberlake - Can't Stop the Feeling!"
    ],
    'sad': [
        "Adele - Someone Like You",
        "Billie Eilish - when the party's over",
        "Coldplay - The Scientist",
        "James Blake - Retrograde",
        "Bon Iver - Holocene",
        "Sia - Breathe Me"
    ],
    'angry': [
        "Rage Against The Machine - Killing in the Name",
        "Nine Inch Nails - Head Like A Hole",
        "Kendrick Lamar - DNA.",
        "Linkin Park - Given Up",
        "System Of A Down - Chop Suey!"
    ],
    'calm': [
        "Ludovico Einaudi - Nuvole Bianche",
        "Yiruma - River Flows in You",
        "Erik Satie - Gymnopédie No.1",
        "Max Richter - On the Nature Of Daylight",
        "Claude Debussy - Clair de Lune"
    ],
    'surprised': [
        "Queen - Bohemian Rhapsody",
        "The Beatles - A Day In The Life",
        "Arcade Fire - Wake Up",
        "M83 - Midnight City"
    ],
    'disgust': [
        "Tool - Sober",
        "Massive Attack - Angel"
    ],
    'fear': [
        "Radiohead - Climbing Up the Walls",
        "Portishead - Roads"
    ],
    'neutral': [
        "Norah Jones - Don't Know Why",
        "John Mayer - Slow Dancing in a Burning Room",
        "Fleetwood Mac - Landslide",
        "Norah Jones - Come Away With Me"
    ]
}

# Tamil mood map (examples)
MOOD_MAP_TAMIL = {
    'happy': [
        "Anirudh - Vaathi Coming",
        "Dhee - Enjoy Enjaami",
        "Sid Sriram - Samajavaragamana",
        "GV Prakash - Rowdy Baby",
        "Arivu - Rowdy Baby (remix)",
        "AR Rahman - Chinna Chinna Aasai",
        "Vijay - Google Google",
        "Sivakarthikeyan - Selfie Pulla",
        "Yuvan Shankar Raja - Rasaali",
        "Hiphop Tamizha - Club Le Mabbu Le",
        "Anirudh - Surviva",
        "Sid Sriram - Adiye",
        "D Imman - Rowdy Baby (variant)",
        "Gana Bala - Aathichudi"
    ],
    'sad': [
        "AR Rahman - Vinnaithaandi Varuvaayaa",
        "Harris Jayaraj - Kaadhal Kan Kattuthe",
        "Karthik - Ennai Vittu",
        "Yuvan - Unnakenna",
        "Anirudh - Kanave Kanave (Tamil)",
        "AR Rahman - Anbil Avan",
        "S.P. Balasubrahmanyam - Kannalane",
        "Ilaiyaraaja - Thoonga Vaanam",
        "Sid Sriram - Yaar Indha Saalai Oram"
    ],
    'calm': [
        "Ilaiyaraaja - Panchathanthiram Theme",
        "Yuvan - Kanneer Poovinte",
        "AR Rahman - Nila Kaigirathu",
        "Harris Jayaraj - Kaadhal Vandha",
        "Anirudh - Nenjukkul Peidhidum",
        "Instrumental - Tamil Flute Medley",
        "Ilaiyaraaja - Mayanginen Thendralo",
        "GV Prakash - Kannaana Kanney (soft)"
    ],
    'neutral': [
        "Instrumental - Tamil Melody",
        "Various - Tamil Background Score",
        "Instrumental - Kollywood Theme"
    ]
}

# Simple synonyms/keywords mapping to help infer mood from arbitrary text
MOOD_SYNONYMS = {
    'happy': ('happy','joy','joyful','glad','cheer','cheerful','excited','elated','pleased','upbeat','celebrate','party','festival','energetic'),
    'sad': ('sad','down','unhappy','blue','sorrow','depressed','tear'),
    'angry': ('angry','mad','furious','annoyed','rage'),
    'calm': ('calm','chill','relax','relaxed','soothing','peaceful','tranquil','study'),
    'surprised': ('surprised','surprise','astonished','amazed','wow','shocked','excited'),
    'disgust': ('disgust','disgusted','ugh','gross'),
    'fear': ('fear','scared','afraid','anxious','nervous'),
    'neutral': ('neutral','okay','meh','fine')
}


def infer_mood_from_prompt(prompt: str) -> Optional[str]:
    """Infer a single mood label from freeform prompt using simple keyword matching.

    Returns one of MOOD_MAP keys or None if not confident.
    """
    if not prompt:
        return None
    p = prompt.lower()
    # exact matches first
    for mood in MOOD_MAP.keys():
        if p.strip() == mood:
            return mood
    # keyword scan
    for mood, keys in MOOD_SYNONYMS.items():
        for k in keys:
            if k in p:
                return mood
    return None

def _format_to_metadata(raw: str) -> Dict:
    raw = (raw or '').strip()
    # simple split attempt
    if ' - ' in raw:
        artist, title = raw.split(' - ', 1)
        return {'title': title.strip(), 'artist': artist.strip(), 'album': None, 'source': 'local', 'url': None}
    return {'title': raw, 'artist': None, 'album': None, 'source': 'local', 'url': None}

def _unique_sample(lst: List[str], k: int) -> List[Dict]:
    # ensure deterministic variety: shuffle but keep consistent per call randomness
    if not lst:
        return []
    choices = lst.copy()
    random.shuffle(choices)
    chosen = choices[:k]
    return [_format_to_metadata(x) for x in chosen]


def _sample_for_mood(mood: str, k: int, language: str = 'english', strict: bool = False) -> List[Dict]:
    """Return up to k unique metadata items for a mood, expanding pool when needed.

    Strategy:
    - If language is tamil, start with Tamil mood list, then other Tamil lists,
      then the English mood list, then other English lists.
    - If language is english, start with English mood list then expand across moods.
    """
    pool = []
    lang = (language or 'english').strip().lower()
    if lang == 'tamil':
        if strict:
            # Strict Tamil-only: only use Tamil map entries for this mood
            pool.extend(MOOD_MAP_TAMIL.get(mood, []))
        else:
            # primary: same mood in Tamil
            pool.extend(MOOD_MAP_TAMIL.get(mood, []))
            # then other Tamil songs
            for v in MOOD_MAP_TAMIL.values():
                pool.extend(v)
            # then English same mood
            pool.extend(MOOD_MAP.get(mood, []))
            # then other English songs
            for v in MOOD_MAP.values():
                pool.extend(v)
    else:
        # english: primary english mood, then other english
        pool.extend(MOOD_MAP.get(mood, []))
        for v in MOOD_MAP.values():
            pool.extend(v)

    # deduplicate while preserving order-ish
    seen = set()
    uniq = []
    for s in pool:
        if s not in seen:
            seen.add(s)
            uniq.append(s)
    # If still not enough, repeat from uniq (allow duplicates as last resort)
    if len(uniq) >= k:
        return _unique_sample(uniq, k)
    # not enough unique entries; return whatever we have and allow duplicates by cycling
    out = uniq.copy()
    i = 0
    while len(out) < k and uniq:
        out.append(uniq[i % len(uniq)])
        i += 1
    return [_format_to_metadata(x) for x in out]


def _ensure_k_metas(metas: List[Dict], k: int) -> List[Dict]:
    """Ensure the returned metadata list has exactly k items by cycling if necessary."""
    if metas is None:
        return []
    if len(metas) >= k:
        return metas[:k]
    if len(metas) == 0:
        return []
    out = metas.copy()
    i = 0
    while len(out) < k:
        out.append(metas[i % len(metas)])
        i += 1
    return out

def get_music_recommendations(prompt: str, num_songs: int = 5, return_source: bool = False, language: str = 'english'):
    """
    Primary entrypoint. If prompt is a simple mood label (one word in our map),
    use MOOD_MAP directly. Otherwise, attempt Gemini/TF-IDF and fall back to heuristics.
    Returns list of metadata dicts or (list, source) if return_source=True
    """
    start_time = time.time()
    # Normalize prompt
    p = (prompt or '').strip().lower()
    logger.info("get_music_recommendations called: prompt=%s num_songs=%s", repr(prompt), num_songs)
    logger.debug("normalized prompt=%s", p)
    # Infer mood from freeform prompt (keyword scan). Prefer inferred mood if found.
    inferred_mood = infer_mood_from_prompt(prompt)
    if inferred_mood:
        strict = (language or 'english').strip().lower() == 'tamil'
        metas = _sample_for_mood(inferred_mood, num_songs, language=language, strict=strict)
        metas = _ensure_k_metas(metas, num_songs)
        return (metas, 'local') if return_source else metas

    # If forced local env var set
    if os.getenv('FORCE_LOCAL_RECOMMENDER', '0') == '1':
        logger.info('FORCE_LOCAL_RECOMMENDER=1, using local heuristics')
        # try to derive mood words from prompt
        for mood in MOOD_MAP.keys():
            if mood in p:
                metas = _sample_for_mood(mood, num_songs, language=language)
                metas = _ensure_k_metas(metas, num_songs)
                logger.info('Returned %s local recommendations for mood=%s', len(metas), mood)
                logger.debug('recommendations=%s', metas)
                return (metas, 'local') if return_source else metas
        # fallback generic sample
        all_songs = []
        for v in MOOD_MAP.values():
            all_songs.extend(v)
        metas = _unique_sample(list(dict.fromkeys(all_songs)), num_songs)
        return (metas, 'local') if return_source else metas

    # Attempt Gemini if available (defensive)
    try:
        model = get_gemini_model() if get_gemini_model is not None else None
    except Exception:
        model = None

    # Use Gemini only when explicitly enabled via env var to avoid long blocking
    use_gemini = os.getenv('USE_GEMINI', '0') == '1'
    if model is not None and use_gemini:
        logger.info('Gemini model present and USE_GEMINI=1; attempting remote generation')
        try:
            lang_note = ''
            if language and language.strip().lower() == 'tamil':
                lang_note = 'Return Tamil-language songs when possible.'
            json_prompt = (
                "You are a music recommendation assistant. "
                f"Given the user description: \"{prompt}\", {lang_note} Return a JSON object: {{\"recommendations\": [\"Artist - Title\", ...]}} with {num_songs} items."
            )
            # Run generation in a thread with a short timeout to avoid blocking the request
            import concurrent.futures
            def gen():
                return model.generate_content(json_prompt)

            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as ex:
                fut = ex.submit(gen)
                try:
                    response = fut.result(timeout=float(os.getenv('GEMINI_TIMEOUT_SECS','6')))
                except concurrent.futures.TimeoutError:
                    logger.warning('Gemini generate_content timed out after %ss; falling back to local', os.getenv('GEMINI_TIMEOUT_SECS','6'))
                    response = None
                except Exception as e:
                    logger.exception('Gemini generation raised an exception')
                    response = None

            if response is not None:
                text = getattr(response, "text", None) or str(response)
                logger.debug('Raw Gemini response: %s', text)
                # try parse JSON
                import json as _json
                parsed = None
                try:
                    parsed = _json.loads(text)
                except Exception:
                    # try to extract JSON-like substring
                    import re
                    m = re.search(r'\{.*"recommendations".*\}', text, re.S)
                    if m:
                        try:
                            parsed = _json.loads(m.group(0))
                        except Exception:
                            parsed = None
                if parsed and isinstance(parsed.get('recommendations'), list):
                    recs = parsed.get('recommendations')[:num_songs]
                    metas = [_format_to_metadata(r) for r in recs]
                    metas = _ensure_k_metas(metas, num_songs)
                    logger.info('Gemini returned %s recommendations', len(metas))
                    logger.debug('recommendations=%s', metas)
                    # If Tamil requested but gemini's results don't look Tamil, fall back to local Tamil map
                    if language and language.strip().lower() == 'tamil':
                        tamil_like = any(any(ch in r.lower() for ch in ('anirudh','rahman','gv','sid','dhee','sriram','ilaiyaraaja','yuvan')) for r in recs)
                        if not tamil_like:
                            logger.info('Gemini results do not appear Tamil; falling back to local Tamil map')
                            for mood in MOOD_MAP_TAMIL.keys():
                                if mood in p:
                                    metas = _sample_for_mood(mood, num_songs, language='tamil')
                                    return (metas, 'local') if return_source else metas
                    return (metas, 'gemini') if return_source else metas
                else:
                    logger.warning('Gemini response did not contain parsable recommendations; falling back')
        except Exception:
            logger.exception("Gemini generation failed; falling back to local")

    # TF-IDF catalog fallback (if available)
    catalog_path = Path(__file__).parents[1] / 'data' / 'song_catalog.json'
    # TF-IDF catalog fallback (if available) - run in worker with timeout to avoid blocking
    try:
        if catalog_path.exists() and SKLEARN_AVAILABLE:
            logger.info('Attempting TF-IDF catalog search at %s', str(catalog_path))
            import concurrent.futures
            def tfidf_search():
                with open(catalog_path, 'r', encoding='utf-8') as f:
                    catalog = json.load(f)
                # If Tamil requested, try to prefer Tamil entries in catalog (simple heuristic by artist/title keywords)
                lang = (language or 'english').strip().lower()
                def is_tamil_entry(entry):
                    txt = (entry.get('title','') + ' ' + (entry.get('artist','') or '') + ' ' + entry.get('tags','')).lower()
                    tamil_keywords = ('anirudh','rahman','sid','sriram','gv prakash','yuvan','harris','ilaiyaraaja','tamiz','tamil','kollywood','dhee','s p bala','s.p. bala')
                    return any(k in txt for k in tamil_keywords)

                if lang == 'tamil':
                    tamil_catalog = [s for s in catalog if is_tamil_entry(s)]
                    if len(tamil_catalog) > 0:
                        # use whatever Tamil entries exist (prefer Tamil-only results)
                        docs = [song.get('tags','') + ' ' + song.get('title','') for song in tamil_catalog]
                        source_catalog = tamil_catalog
                    else:
                        # no Tamil entries in catalog: skip TF-IDF to let local Tamil map handle recommendations
                        logger.info('TF-IDF: no tamil entries in catalog; skipping TF-IDF for Tamil request')
                        return []
                else:
                    docs = [song.get('tags','') + ' ' + song.get('title','') for song in catalog]
                    source_catalog = catalog

                tf = TfidfVectorizer().fit_transform(docs + [prompt])
                sim = linear_kernel(tf[-1:], tf[:-1]).flatten()
                top_idx = sim.argsort()[::-1][:num_songs]
                metas = []
                for i in top_idx:
                    s = source_catalog[i]
                    metas.append({'title': s.get('title'), 'artist': s.get('artist'), 'album': s.get('album'), 'source': 'local', 'url': s.get('url')})
                return metas

            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as ex:
                fut = ex.submit(tfidf_search)
                try:
                    metas = fut.result(timeout=float(os.getenv('TFIDF_TIMEOUT_SECS','4')))
                    # If TF-IDF returned nothing (e.g., skipped due to lack of Tamil catalog entries), fall through to local fallback
                    if metas:
                        metas = _ensure_k_metas(metas, num_songs)
                        logger.info('TF-IDF returned %s recommendations', len(metas))
                        logger.debug('recommendations=%s', metas)
                        return (metas, 'local') if return_source else metas
                    else:
                        logger.info('TF-IDF returned no results (likely skipped for language constraints); falling back to local')
                except concurrent.futures.TimeoutError:
                    logger.warning('TF-IDF search timed out after %ss; falling back', os.getenv('TFIDF_TIMEOUT_SECS','4'))
                except Exception:
                    logger.exception('TF-IDF search raised an exception')
    except Exception:
        logger.exception("TF-IDF fallback failed (outer)")

    # heuristic keyword -> mood mapping
    for mood in MOOD_MAP.keys():
        if mood in p or any(word in p for word in [mood]):
            metas = _sample_for_mood(mood, num_songs, language=language)
            metas = _ensure_k_metas(metas, num_songs)
            return (metas, 'local') if return_source else metas

    # final generic mixed fallback (when Tamil requested, prefer Tamil map first)
    lang = (language or 'english').strip().lower()
    if lang == 'tamil':
        # build from Tamil map first, then English if needed
        all_songs = []
        for v in MOOD_MAP_TAMIL.values():
            all_songs.extend(v)
        # if tamil pool is too small, append english to increase variety
        if len(all_songs) < num_songs:
            for v in MOOD_MAP.values():
                all_songs.extend(v)
    else:
        all_songs = []
        for v in MOOD_MAP.values():
            all_songs.extend(v)

    metas = _unique_sample(list(dict.fromkeys(all_songs)), num_songs)
    metas = _ensure_k_metas(metas, num_songs)
    elapsed = time.time() - start_time
    logger.info('Returning fallback %s recommendations after %.3fs', len(metas), elapsed)
    logger.debug('recommendations=%s', metas)
    return (metas, 'local') if return_source else metas

if __name__ == "__main__":
    print(get_music_recommendations("sad", 5))
    print(get_music_recommendations("chill, study, calm", 5))
