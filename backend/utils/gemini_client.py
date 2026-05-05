import os
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()


def get_gemini_model():
    """Return a configured Gemini GenerativeModel or None if no API key.

    This function avoids importing/configuring the google.generativeai client
    unless an API key is present. When no key is found it returns None so
    callers can fall back to local logic.
    """
    api_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
    if not api_key:
        logger.info('No GEMINI_API_KEY or GOOGLE_API_KEY set; not initializing Gemini client.')
        return None

    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        return genai.GenerativeModel("gemini-pro")
    except Exception as e:
        logger.exception('Failed to initialize Gemini client: %s', e)
        return None