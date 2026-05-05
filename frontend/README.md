# Music Recommender Frontend

This is a minimal React + Vite frontend for the Music Recommender Flask API.

Prerequisites:
- Node 18+ and npm
- The backend Flask server running on http://127.0.0.1:5000

Install & run

```powershell
cd frontend
npm install
npm run dev
```

The dev server runs on http://localhost:5173 by default. The frontend posts to `http://127.0.0.1:5000/recommend`.

If your backend runs on a different host/port, update the fetch URL in `src/components/RecommendForm.jsx`.
