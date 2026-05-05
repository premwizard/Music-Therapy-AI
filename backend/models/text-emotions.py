from utils.gemini_client import get_gemini_model

def analyze_text_emotion(text):
    model = get_gemini_model()
    prompt = f"Analyze the emotional tone of this message and respond with a single dominant mood (e.g., happy, sad, angry, neutral, etc.):\n\n{text}"
    
    response = model.generate_content(prompt)
    mood = response.text.strip().lower()
    return mood