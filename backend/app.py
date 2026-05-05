import logging
from flask import Flask, jsonify, request
from flask_cors import CORS

from routes.auth import auth_bp
from routes.emotion import emotion_bp
from routes.ai import ai_bp
from routes.music import music_bp
from routes.mood import mood_bp

from controllers.auth_controller import register_user, login_user, profile_get, profile_update
from controllers.emotion_controller import detect_multimodal
from services.music_service import infer_emotion_from_prompt, recommend_songs
from services.emotion_service import detect_image_emotion, detect_text_emotion, detect_voice_emotion, combine_emotions

logger = logging.getLogger(__name__)
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s'))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(emotion_bp, url_prefix='/api/emotion')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(music_bp, url_prefix='/api/music')
    app.register_blueprint(mood_bp, url_prefix='/api/mood')

    @app.route('/')
    def index():
        return jsonify({'message': 'Music Therapy AI Backend is running'}), 200

    @app.route('/register', methods=['POST'])
    def register_compat():
        return register_user()

    @app.route('/login', methods=['POST'])
    def login_compat():
        return login_user()

    @app.route('/profile', methods=['GET', 'POST'])
    def profile_compat():
        if request.method == 'GET':
            return profile_get()
        return profile_update()

    @app.route('/multimodal', methods=['POST'])
    def multimodal_compat():
        return detect_multimodal()

    @app.route('/recommend', methods=['POST'])
    def recommend_compat():
        payload = request.get_json(silent=True) or {}
        if not payload:
            payload = request.form.to_dict() or {}

        prompt = payload.get('prompt', '')
        num_songs = int(payload.get('num_songs', 5))
        emotion = payload.get('emotion') or infer_emotion_from_prompt(prompt)
        recommendations = recommend_songs(emotion, limit=num_songs)

        return jsonify({
            'emotion': emotion,
            'recommendations': recommendations,
            'source': 'compat',
        }), 200

    @app.route('/recommend-multimodal', methods=['POST'])
    def recommend_multimodal_compat():
        prompt = request.form.get('prompt', '')
        emotion = infer_emotion_from_prompt(prompt)

        per_modality = {}
        if 'image' in request.files:
            per_modality['face'] = detect_image_emotion(request.files['image'])['emotion']
        if 'audio' in request.files:
            per_modality['audio'] = detect_voice_emotion(request.files['audio'])['emotion']
        if prompt:
            per_modality['text'] = detect_text_emotion(prompt)['emotion']

        combined = combine_emotions([e for e in per_modality.values() if e]) if per_modality else emotion
        recommendations = recommend_songs(combined, limit=int(request.form.get('num_songs', 5)))
        return jsonify({
            'emotion': combined,
            'per_modality': per_modality,
            'recommendations': recommendations,
        }), 200

    return app


app = create_app()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
