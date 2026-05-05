import os
import logging
import google.generativeai as genai
from typing import List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(_name_)

# Load Gemini API key from environment variable
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.warning("GEMINI_API_KEY environment variable is not set. "
                   "Make sure to set it before running the app.")

genai.configure(api_key=API_KEY)

# Initialize Gemini model
model = genai.GenerativeModel("gemini-pro")

def get_music_recommendations(prompt: str, num_songs: int = 5) -> List[str]:
    """
    Uses Google's Gemini model to generate music recommendations based on a user prompt.

    Args:
        prompt (str): User input describing mood, genre, activity, etc.
        num_songs (int): Number of song recommendations to return.

    Returns:
        List[str]: List of recommended songs as strings.
    """
    try:
        full_prompt = (
            f"Please recommend {num_songs} songs based on the following description: \"{prompt}\". "
            "Return the list as numbered items, one song per line."
        )

        response = model.generate_content(full_prompt)

        # Split response by lines, strip whitespace and remove empty lines
        recommendations = [line.strip() for line in response.text.split("\n") if line.strip()]

        # Optional: Remove numbering from the lines, e.g. "1. Song Name" -> "Song Name"
        cleaned_recommendations = []
        for line in recommendations:
            # Remove numbering if present (e.g. "1. ", "2) ", etc.)
            cleaned = line
            if line[0].isdigit() and (line[1] == '.' or line[1] == ')'):
                cleaned = line[2:].strip()
            cleaned_recommendations.append(cleaned)

        return cleaned_recommendations

    except Exception as e:
        logger.error(f"Error generating recommendations: {e}", exc_info=True)
        return [f"Error generating recommendations: {str(e)}"]