from flask import jsonify


def success_response(data=None, message='OK', status=200):
    return jsonify({'success': True, 'message': message, 'data': data or {}}), status


def error_response(message='An error occurred', status=400, data=None):
    return jsonify({'success': False, 'message': message, 'data': data or {}}), status
