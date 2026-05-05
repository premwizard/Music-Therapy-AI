import React from 'react';
import './Home.css'; // We'll define styling separately

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero card">
        <div className="hero-left">
          <h1>Music that matches your mood</h1>
          <p className="lead">
            AI-driven recommendations combining text, voice, and face analysis to deliver music that enhances focus, relaxation, and emotional wellbeing.
          </p>
          <div className="hero-ctas">
            <button className="btn primary">Get Recommendations</button>
            <button className="btn ghost">Learn More</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="example-card card">
            <h4>Example Input</h4>
            <p><strong>"Calm piano for studying"</strong></p>
            <ul>
              <li>Clair de Lune — Debussy</li>
              <li>Nuvole Bianche — Einaudi</li>
              <li>River Flows in You — Yiruma</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature card">
          <h3>Multimodal</h3>
          <p>Analyze text, voice, or face images to understand your mood.</p>
        </div>
        <div className="feature card">
          <h3>Personalized</h3>
          <p>Recommendations adapt to your emotional state and context.</p>
        </div>
        <div className="feature card">
          <h3>Privacy-first</h3>
          <p>Local processing and opt-in AI models for sensitive data.</p>
        </div>
      </section>
    </div>
  );
}
