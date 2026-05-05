import datetime
from os import getenv

import jwt

JWT_SECRET_KEY = getenv('JWT_SECRET_KEY', 'replace-with-a-secure-secret')
JWT_ALGORITHM = 'HS256'
JWT_ACCESS_TOKEN_EXPIRES_MINUTES = int(getenv('JWT_ACCESS_TOKEN_EXPIRES_MINUTES', '1440'))


def create_access_token(subject: str) -> str:
    now = datetime.datetime.utcnow()
    payload = {
        'sub': subject,
        'iat': now,
        'exp': now + datetime.timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRES_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])


def get_token_from_header(authorization_header: str) -> str | None:
    if not authorization_header:
        return None
    bearer = authorization_header.strip().split()
    if len(bearer) == 2 and bearer[0].lower() == 'bearer':
        return bearer[1]
    return authorization_header.strip()
