# Music Therapy AI 🎵

A comprehensive AI-powered music recommendation system that detects emotions through multiple modalities (facial expression, voice tone, and text sentiment) and recommends personalized music for therapeutic purposes.

## Overview

Music Therapy AI combines modern machine learning with music therapy principles to provide personalized music recommendations based on real-time emotion detection. The system analyzes user emotions through three channels:

- **Facial Recognition**: Detects emotions from facial expressions using computer vision
- **Voice Analysis**: Analyzes tone and emotion from speech patterns
- **Text Sentiment**: Evaluates emotional content from written text

These multi-modal inputs are combined to provide accurate emotion detection and tailored music recommendations for therapeutic benefit.

## Features

✨ **Multimodal Emotion Detection**
- Real-time facial emotion recognition
- Speech emotion analysis
- Text sentiment analysis
- Combined emotion inference for comprehensive understanding

🎶 **Intelligent Music Recommendations**
- AI-powered music suggestions based on detected emotions
- Large song catalog with metadata
- Personalized recommendations using machine learning

🔐 **User Authentication & Profiles**
- Secure user registration and login with JWT
- User profile management
- Preference tracking and history

💬 **AI Chat Interface**
- Conversational AI assistant
- Music therapy recommendations
- Mood tracking and insights

📊 **Dashboard & Analytics**
- User mood history and trends
- Recommendation analytics
- Session statistics

## Tech Stack

### Backend
- **Framework**: Flask 2.3.3
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **AI/ML**: 
  - LangChain + Ollama (local LLMs)
  - Librosa (audio analysis)
  - scikit-learn (machine learning)
  - Speech Recognition (voice-to-text)
- **APIs**: CORS-enabled REST API

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.20
- **Styling**: Tailwind CSS 3.4.4
- **Routing**: React Router DOM 6.14.1
- **Server**: Node.js

## Project Structure

```
Music Therapy AI/
├── backend/
│   ├── app.py                 # Flask app initialization
│   ├── requirement.txt        # Python dependencies
│   ├── controllers/           # Request handlers
│   │   ├── ai_controller.py
│   │   ├── auth_controller.py
│   │   ├── emotion_controller.py
│   │   ├── mood_controller.py
│   │   └── music_controller.py
│   ├── models/               # ML models
│   │   ├── face_emotion.py
│   │   ├── speech_emotion.py
│   │   └── text_emotion.py
│   ├── routes/               # API endpoints
│   ├── services/             # Business logic
│   │   ├── ai_service.py
│   │   ├── auth_service.py
│   │   ├── emotion_service.py
│   │   ├── mood_service.py
│   │   └── music_service.py
│   ├── utils/                # Utilities
│   │   ├── db.py
│   │   ├── jwt.py
│   │   ├── gemini_client.py
│   │   ├── music_recommender.py
│   │   └── multimodal_emotion.py
│   ├── data/
│   │   └── song_catalog.json
│   └── tests/                # Test files
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API clients
│   │   └── lib/              # Utilities
│   └── image/                # Static assets
└── README.md
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Ollama (for local LLM capabilities)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

PREM M

## Acknowledgments

- LangChain community for AI framework
- Ollama for language models
- Music therapy research community
- Contributors and supporters

