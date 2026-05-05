from flask import Blueprint

from controllers.emotion_controller import detect_text, detect_image, detect_voice, detect_multimodal

emotion_bp = Blueprint('emotion', __name__)

emotion_bp.add_url_rule('/text', 'text', detect_text, methods=['POST'])
emotion_bp.add_url_rule('/image', 'image', detect_image, methods=['POST'])
emotion_bp.add_url_rule('/voice', 'voice', detect_voice, methods=['POST'])
emotion_bp.add_url_rule('/multimodal', 'multimodal', detect_multimodal, methods=['POST'])
