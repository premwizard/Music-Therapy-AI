from flask import request

from services.auth_service import register_user as register_user_service, verify_credentials, get_user_by_username, update_user_meta
from utils.api_response import success_response, error_response
from utils.jwt import create_access_token, decode_access_token


def register_user():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')
    meta = data.get('meta') or {}

    if not username or not password:
        return error_response('username and password are required', status=400)

    if get_user_by_username(username):
        return error_response('User already exists', status=409)

    ok = register_user_service(username, password, meta)
    if not ok:
        return error_response('Failed to create user', status=500)

    token = create_access_token(username)
    return success_response({'access_token': token}, 'User registered', status=201)


def login_user():
    data = request.get_json(silent=True) or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return error_response('username and password are required', status=400)

    if not verify_credentials(username, password):
        return error_response('Invalid credentials', status=401)

    token = create_access_token(username)
    return success_response({'access_token': token}, 'Login successful', status=200)


def _extract_username_from_token():
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip() if auth_header else request.args.get('token')
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        return payload.get('sub')
    except Exception:
        return None


def profile_get():
    username = _extract_username_from_token()
    if not username:
        return error_response('Invalid or expired token', status=401)

    user = get_user_by_username(username)
    if not user:
        return error_response('User not found', status=404)
    return success_response({'username': username, 'meta': user.get('meta', {})}, 'Profile retrieved', status=200)


def profile_update():
    username = _extract_username_from_token()
    if not username:
        return error_response('Invalid or expired token', status=401)

    data = request.get_json(silent=True) or {}
    meta = data.get('meta') or {}
    ok = update_user_meta(username, meta)
    if not ok:
        return error_response('Could not update profile', status=500)
    return success_response({'username': username, 'meta': meta}, 'Profile updated', status=200)
