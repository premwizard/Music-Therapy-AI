import React, { useState } from "react";
import "./RecommendForm.css";

export default function RecommendForm() {
  const [prompt, setPrompt] = useState("");
  const [numSongs, setNumSongs] = useState(5);
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [detectedMood, setDetectedMood] = useState(null);
  const [perModality, setPerModality] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResults([]);

    try {
      let res;
  if (imageFile || audioFile) {
        const fd = new FormData();
        fd.append("prompt", prompt);
        fd.append("num_songs", Number(numSongs));
  fd.append('language', language)
        if (imageFile) fd.append("image", imageFile);
        if (audioFile) fd.append("audio", audioFile);
        // use relative path so Vite proxy applies in dev
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10000);
        try{
          res = await fetch(`/recommend-multimodal`, {
            method: "POST",
            body: fd,
            signal: ctrl.signal,
          })
        }catch(e){
          // Convert AbortError to a readable timeout message
          if(e.name === 'AbortError'){
            throw new Error('Request timed out (server took too long)')
          }
          throw e
        }finally{ clearTimeout(timeout) }
      } else {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10000);
        try{
          res = await fetch(`/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, num_songs: Number(numSongs), language }),
            signal: ctrl.signal,
          })
        }catch(e){
          if(e.name === 'AbortError'){
            throw new Error('Request timed out (server took too long)')
          }
          throw e
        }finally{ clearTimeout(timeout) }
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(body.error || "Server error");
      }

      const data = await res.json();
      setResults(data.recommendations || []);
      if (data.mood) setDetectedMood(data.mood);
      if (data.per_modality) setPerModality(data.per_modality);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="recommend">
      <h1 className="recommend-title">🎵 AI Music Recommender</h1>
      <p className="recommend-subtitle">
        Get personalized songs based on your mood, image, or voice.
      </p>

      <form onSubmit={handleSubmit} className="recommend-form">
        <label>
          <span>Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. calm piano for studying"
            rows={3}
          />
        </label>

        <label>
          Upload Face Image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files && e.target.files[0])}
          />
        </label>

        <label>
          Upload Voice Audio (optional)
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files && e.target.files[0])}
          />
        </label>

        <label>
          Number of Songs
          <input
            type="number"
            value={numSongs}
            onChange={(e) => setNumSongs(e.target.value)}
            min={1}
            max={20}
          />
        </label>

        <label>
          Language
          <select value={language} onChange={e=>setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="tamil">Tamil</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "🎧 Generating..." : "Get Recommendations"}
        </button>
      </form>

      <div className="recommend-results">
        {detectedMood && (
          <div className="mood-display">
            Detected Mood: <span className="mood-pill">{detectedMood}</span>
          </div>
        )}

        {perModality && Object.keys(perModality).length > 0 && (
          <div className="modality-section">
            <strong>Per-modality:</strong>
            <div className="modality-tags">
              {perModality.face && (
                <div className="mood-pill">Face: {perModality.face}</div>
              )}
              {perModality.audio && (
                <div className="mood-pill">Audio: {perModality.audio}</div>
              )}
              {perModality.text && (
                <div className="mood-pill">Text: {perModality.text}</div>
              )}
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {results.length > 0 && (
          <ol className="song-list">
            {results.map((r, i) => (
              <li key={i} className="song-card">
                <div className="song-info">
                  <div className="song-title">{r.title || r}</div>
                  {r.artist && <div className="song-artist">{r.artist}</div>}
                  {r.album && <div className="song-album">{r.album}</div>}
                  <div className="song-links">
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn"
                      >
                        Open ({r.source || "link"})
                      </a>
                    )}
                    <a
                      href={`https://open.spotify.com/search/${encodeURIComponent(
                        (r.title || "") + (r.artist ? " " + r.artist : "")
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn spotify"
                    >
                      Spotify
                    </a>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        (r.title || "") + (r.artist ? " " + r.artist : "")
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn youtube"
                    >
                      YouTube
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
