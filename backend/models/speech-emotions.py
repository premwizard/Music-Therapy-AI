import speech_recognition as sr
from models.text_emotion import analyze_text_emotion

def analyze_voice_emotion(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
        except Exception as e:
            return "unknown"
    return analyze_text_emotion(text)