import { Link } from 'react-router-dom'
import heroImage from '../../image/20260427_1719_image.png'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f0f4f2] text-[#0d1a15] animate-fade-in">

      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-20 px-6 md:px-12 lg:px-20">
        
        {/* LEFT */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-wide">
            Music <span className="text-[#2ecc8a]">Therapy</span> AI
          </h1>

          <p className="text-lg text-gray-700 max-w-md">
            Understand your emotions and get personalized therapy with music.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 border-2 border-[#2ecc8a] text-[#2ecc8a] hover:bg-[#2ecc8a] hover:text-[#0d1a15] transition-all duration-300"
          >
            START SESSION
          </Link>
        </div>

        {/* RIGHT */}
        <div className="border-2 border-[#2ecc8a] bg-[#0d1a15] p-4 md:p-6">
          <div className="w-full h-full overflow-hidden bg-[#0d1a15]">
            <img
              src={heroImage}
              alt="Hero music therapy scene"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {[
            {
              title: "Emotion Detection",
              desc: "Detect mood using text, image, or voice."
            },
            {
              title: "AI Therapy",
              desc: "Get personalized emotional support."
            },
            {
              title: "Music Recommendation",
              desc: "Songs based on your current mood."
            },
            {
              title: "Mood Tracking",
              desc: "Track emotions over time."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="border-2 border-[#2ecc8a] p-6 bg-[#0d1a15] text-[#f0f4f2] hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl font-bold mb-10 uppercase">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            "Input your mood (text/image/voice)",
            "AI analyzes your emotion",
            "Get therapy + music recommendation"
          ].map((step, index) => (
            <div
              key={index}
              className="border-2 border-[#2ecc8a] p-6 hover:scale-105 transition-all duration-300"
            >
              <h4 className="text-xl font-bold mb-2">
                {index + 1}
              </h4>
              <p>{step}</p>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[#2ecc8a]">

        <h2 className="text-2xl font-bold">
          Start your music therapy session now
        </h2>

        <Link
          to="/login"
          className="px-6 py-3 border-2 border-[#2ecc8a] text-[#2ecc8a] hover:bg-[#2ecc8a] hover:text-[#0d1a15] transition-all duration-300"
        >
          GET STARTED
        </Link>

      </section>

    </main>
  )
}