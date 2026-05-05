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

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/music-therapy-ai.git
cd music-therapy-ai/backend
```

2. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirement.txt
```

4. **Configure environment variables**
Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/music_therapy
JWT_SECRET=your_jwt_secret_key_here
FLASK_ENV=development
```

5. **Initialize the database**
```bash
python init_db.py
```

6. **Start the backend server**
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### User Registration & Login
1. Navigate to the login page
2. Create a new account or log in with existing credentials
3. Access the dashboard

### Emotion Detection & Music Recommendations
1. **Multimodal Form**: Use the multimodal recommendation form to:
   - Upload a photo for facial emotion detection
   - Record or upload audio for voice emotion analysis
   - Enter text for sentiment analysis

2. **AI Assistant**: Chat with the AI for music therapy recommendations

3. **Dashboard**: View your mood history, recommendations, and trends

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/profile` - Update user profile

### Emotion Detection
- `POST /api/emotion/detect-multimodal` - Multimodal emotion detection
- `POST /api/emotion/detect-image` - Facial emotion detection
- `POST /api/emotion/detect-text` - Text sentiment analysis
- `POST /api/emotion/detect-voice` - Voice emotion detection

### Music Recommendations
- `POST /api/music/recommend` - Get music recommendations
- `GET /api/music/catalog` - Get song catalog

### AI Services
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/infer-emotion` - Infer emotion from text prompt

### Mood Tracking
- `GET /api/mood/history` - Get mood history
- `POST /api/mood/record` - Record a mood entry

## Configuration

### Backend Configuration
- Modify settings in `.env` file
- Database: Configure MongoDB connection
- Authentication: Set JWT secret key
- API: CORS is enabled for development

### Frontend Configuration
- Vite config: `frontend/vite.config.js`
- Tailwind styles: `frontend/tailwind.config.js`
- API endpoint: Configure in `frontend/src/services/api.js`

## Testing

### Run Backend Tests
```bash
# Test recommender system
python run_recommend_test.py

# Test API endpoints
python tests/run_api_tests.py

# Test multimodal emotion detection
python test_profile_flow.py
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Integration with more music streaming services
- [ ] Advanced sentiment analysis with transformer models
- [ ] Real-time mood notifications
- [ ] Export mood reports and recommendations
- [ ] Mobile app version
- [ ] Video emotion detection
- [ ] Multi-language support

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running on `localhost:27017`
- **Module Not Found**: Run `pip install -r requirement.txt` again
- **Port Already in Use**: Change Flask port in `app.py`

### Frontend Issues
- **Port Conflict**: Vite will automatically use next available port
- **Dependencies Missing**: Run `npm install` to ensure all packages are installed
- **CORS Errors**: Ensure backend CORS is properly configured

### Emotion Detection Issues
- **Face Detection Not Working**: Install optional deepface dependency: `pip install deepface`
- **Audio Analysis Issues**: Ensure `librosa` and audio libraries are properly installed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Authors

- Your Name - Initial work

## Support

For support, email support@musictherapyai.com or open an issue on GitHub.

## Acknowledgments

- LangChain community for AI framework
- OpenAI/Ollama for language models
- Music therapy research community
- Contributors and supporters

---

**Built with ❤️ for therapeutic music experiences**
