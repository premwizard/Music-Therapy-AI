from functools import wraps
from flask import request

from services.auth_service import get_user_by_username
from utils.api_response import error_response
from utils.jwt import decode_access_token, get_token_from_header


def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        token = get_token_from_header(auth_header) or request.args.get('token')
        if not token:
            return error_response('Authorization token required', status=401)
        try:
            payload = decode_access_token(token)
            username = payload.get('sub')
        except Exception:
            return error_response('Invalid or expired token', status=401)

        user = get_user_by_username(username)
        if not user:
            return error_response('Invalid token user', status=401)

        request.current_user = user
        return fn(*args, **kwargs)

    return wrapper
