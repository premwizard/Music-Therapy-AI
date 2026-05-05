from flask import Blueprint

from controllers.music_controller import recommend_music

music_bp = Blueprint('music', __name__)
music_bp.add_url_rule('/recommend', 'recommend', recommend_music, methods=['GET'])
