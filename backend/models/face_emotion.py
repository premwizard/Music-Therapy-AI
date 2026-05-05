from utils.gemini_client import get_gemini_model
from PIL import Image
import io

def analyze_face_emotion(image_file):
    image = Image.open(image_file)
    model = genai.GenerativeModel("gemini-pro-vision")
    
    prompt = "What is the most likely emotion shown on this person's face?"
    
    response = model.generate_content([prompt, image])
    mood = response.text.strip().lower()
    return mood