from flask import Blueprint

from controllers.mood_controller import save_mood, mood_history

mood_bp = Blueprint('mood', __name__)
mood_bp.add_url_rule('/save', 'save_mood', save_mood, methods=['POST'])
mood_bp.add_url_rule('/history', 'mood_history', mood_history, methods=['GET'])
