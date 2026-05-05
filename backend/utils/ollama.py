import json
from os import getenv
from typing import Optional

from langchain_ollama import OllamaLLM

OLLAMA_URL = getenv('OLLAMA_URL', 'http://127.0.0.1:11434')
OLLAMA_MODEL = getenv('OLLAMA_MODEL', 'phi3')
OLLAMA_TIMEOUT_SECONDS = int(getenv('OLLAMA_TIMEOUT_SECONDS', '10'))
OLLAMA_MAX_TOKENS = int(getenv('OLLAMA_MAX_TOKENS', '128'))
OLLAMA_TEMPERATURE = float(getenv('OLLAMA_TEMPERATURE', '0.25'))

_llm_instance: Optional[OllamaLLM] = None


def get_ollama_llm() -> OllamaLLM:
    global _llm_instance
    if _llm_instance is None:
        _llm_instance = OllamaLLM(
            model=OLLAMA_MODEL,
            base_url=OLLAMA_URL,
            temperature=OLLAMA_TEMPERATURE,
            max_tokens=OLLAMA_MAX_TOKENS,
            timeout=OLLAMA_TIMEOUT_SECONDS,
        )
    return _llm_instance


def parse_llm_json_response(raw_text: str) -> dict:
    if not isinstance(raw_text, str):
        raw_text = str(raw_text)
    try:
        return json.loads(raw_text)
    except Exception:
        start = raw_text.find('{')
        end = raw_text.rfind('}')
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(raw_text[start:end + 1])
            except Exception:
                pass
    return {}
