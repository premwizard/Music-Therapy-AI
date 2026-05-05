# app.py

from flask import Flask, request, jsonify
import os

try:
    from utils.music_recommender import get_music_recommendations
except Exception as e:
    print(f"Error importing recommender: {e}")
    get_music_recommendations = None  # Handle safely

app = Flask(__name__)

@app.route("/")
def index():
    return "🎵 Welcome to the Gemini Music Recommender API!"

@app.route("/recommend", methods=["POST"])
def recommend():
    # Debug print
    print("Received POST /recommend request")

    # Parse JSON data
    data = request.get_json()
    print("Request data:", data)

    user_input = data.get("prompt", "")
    num_songs = data.get("num_songs", 5)

    if not user_input:
        return jsonify({"error": "Prompt is required"}), 400

    # If recommender is not loaded
    if get_music_recommendations is None:
        return jsonify({"error": "Music recommender not available"}), 500

    # Call recommender and return results
    recommendations = get_music_recommendations(user_input, num_songs)
    print("Recommendations:", recommendations)

    return jsonify({
        "prompt": user_input,
        "recommendations": recommendations
    })


if __name__ == "_main_":
    print("✅ Starting Flask server...")
    app.run(debug=True, use_reloader=True)