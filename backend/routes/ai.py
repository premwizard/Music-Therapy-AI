from flask import Blueprint

from controllers.ai_controller import therapy

ai_bp = Blueprint('ai', __name__)
ai_bp.add_url_rule('/therapy', 'therapy', therapy, methods=['POST'])
