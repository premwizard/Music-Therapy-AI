import json
import sys
import uuid
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from app import app

TEST_USER = f"testuser_{uuid.uuid4().hex[:8]}"
TEST_PASSWORD = "TestPass123!"


def print_result(name, response):
    print(f"--- {name}")
    print("status:", response.status_code)
    try:
        payload = response.get_json(silent=True)
    except Exception:
        payload = None
    print("json:", json.dumps(payload, indent=2, default=str) if payload is not None else response.data)
    print()
    return payload


def post_json(client, path, payload=None, headers=None):
    return client.post(path, json=payload or {}, headers=headers or {})


def run_tests():
    client = app.test_client()

    print("Backend test script running against the Flask app")
    print("Backend root:", BACKEND_DIR)

    print_result("health", client.get("/"))

    print_result("register-missing", post_json(client, "/api/auth/register", {}))
    print_result("login-missing", post_json(client, "/api/auth/login", {}))

    register_resp = post_json(client, "/api/auth/register", {"username": TEST_USER, "password": TEST_PASSWORD})
    register_data = print_result("register", register_resp)

    login_resp = post_json(client, "/api/auth/login", {"username": TEST_USER, "password": TEST_PASSWORD})
    login_data = print_result("login", login_resp)

    auth_token = login_data.get("data", {}).get("access_token") if login_data else None
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}

    print_result("profile-get", client.get("/api/auth/profile", headers=headers))
    print_result("profile-update", post_json(client, "/api/auth/profile", {"meta": {"mood": "curious"}}, headers=headers))
    print_result("profile-get-after-update", client.get("/api/auth/profile", headers=headers))

    print_result("emotion-text", post_json(client, "/api/emotion/text", {"text": "I feel calm and relaxed."}))
    print_result("emotion-image-missing", client.post("/api/emotion/image"))
    print_result("emotion-voice-missing", client.post("/api/emotion/voice"))
    print_result("emotion-multimodal", post_json(client, "/api/emotion/multimodal", {"text": "I am excited and content."}))
    print_result("compatible-multimodal", post_json(client, "/multimodal", {"text": "I am excited and content."}))

    print_result("ai-therapy", post_json(client, "/api/ai/therapy", {"emotion": "sad", "message": "I feel down today."}))
    print_result("music-recommend-api", client.get("/api/music/recommend", query_string={"emotion": "happy"}))
    print_result("music-recommend-compat", client.post("/recommend", json={"emotion": "happy"}))
    print_result("music-recommend-compat-prompt", client.post("/recommend", json={"prompt": "uplifting pop songs", "num_songs": 5}))
    print_result("recommend-multimodal-compat", client.post("/recommend-multimodal", data={"prompt": "a warm acoustic playlist", "num_songs": "3"}))

    if auth_token:
        print_result("mood-save", post_json(client, "/api/mood/save", {"emotion": "happy", "notes": "Automated test mood save.", "source": "manual"}, headers=headers))
        print_result("mood-history", client.get("/api/mood/history", headers=headers))
    else:
        print("Skipping mood tests because authentication did not produce a token.")


if __name__ == "__main__":
    run_tests()
