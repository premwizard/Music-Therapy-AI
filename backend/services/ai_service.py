import json
import logging

from utils.ollama import get_ollama_llm, parse_llm_json_response

logger = logging.getLogger(__name__)

THERAPY_PROMPT = '''You are a calm and supportive AI therapist.
The user is feeling: {emotion}
User message: {message}

Respond with structured JSON only using these keys:
response - a short empathetic message
suggestions - an array of 2-3 helpful suggestions
musicMood - a single music mood keyword

Example:
{{"response":"...","suggestions":["...","..."],"musicMood":"calm"}}'''

DEFAULT_THERAPY_RESPONSE = {
    'response': 'I hear you, and I am here with you. When emotions feel heavy, small soothing steps can help.',
    'suggestions': [
        'Take three slow, deep breaths',
        'Listen to a gentle instrumental playlist',
        'Write down one thing you are grateful for today',
    ],
    'musicMood': 'calm',
}


def _extract_text_from_result(result) -> str:
    if not result:
        return ''

    output = ''
    if getattr(result, 'generations', None) is not None:
        first = result.generations[0]
        if isinstance(first, list) and first:
            candidate = first[0]
            output = getattr(candidate, 'text', '') or getattr(candidate, 'generation', '') or ''
        elif hasattr(first, 'text'):
            output = first.text

    return output or ''


def create_therapy_response(emotion: str, message: str) -> dict:
    try:
        llm = get_ollama_llm()
        prompt_text = THERAPY_PROMPT.format(
            emotion=emotion or 'neutral',
            message=message or '',
        )
        result = llm.generate([prompt_text])
        raw_text = _extract_text_from_result(result)

        parsed = parse_llm_json_response(raw_text)
        if not parsed:
            logger.warning('Empty or invalid LLM response, returning fallback therapy content.')
            return DEFAULT_THERAPY_RESPONSE.copy()

        return {
            'response': parsed.get('response', '').strip() or DEFAULT_THERAPY_RESPONSE['response'],
            'suggestions': parsed.get('suggestions') if isinstance(parsed.get('suggestions'), list) else DEFAULT_THERAPY_RESPONSE['suggestions'],
            'musicMood': parsed.get('musicMood', DEFAULT_THERAPY_RESPONSE['musicMood']),
        }
    except Exception as exc:
        logger.exception('Therapy response generation failed: %s', exc)
        return DEFAULT_THERAPY_RESPONSE.copy()
