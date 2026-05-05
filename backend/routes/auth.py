from flask import Blueprint

from controllers.auth_controller import register_user, login_user, profile_get, profile_update

auth_bp = Blueprint('auth', __name__)

auth_bp.add_url_rule('/register', 'register', register_user, methods=['POST'])
auth_bp.add_url_rule('/login', 'login', login_user, methods=['POST'])
auth_bp.add_url_rule('/profile', 'profile_get', profile_get, methods=['GET'])
auth_bp.add_url_rule('/profile', 'profile_update', profile_update, methods=['POST'])
