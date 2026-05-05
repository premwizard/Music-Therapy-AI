import { useEffect, useState } from 'react'
import Button from '../components/Button'
import SongCard from '../components/SongCard'
import PageHeader from '../components/PageHeader'
import { getMusicRecommendations } from '../services/api'

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function fetchRecommendations() {
      try {
        const data = await getMusicRecommendations('calm', 4)
        if (active) {
          setRecommendations(data.recommendations || [])
        }
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchRecommendations()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="w-full min-h-screen bg-[#f0f4f2] text-[#0d1a15]">
      <main className="w-full flex justify-center py-10">
        <div className="w-full max-w-[1200px] px-6 md:px-12">

          {/* HEADER */}
          <PageHeader
            eyebrow="Dashboard"
            title="Your Music Therapy Session"
            description="Detect your mood, get AI guidance, and listen to music tailored for you."
          />

          {/* MAIN INPUT SECTION */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">

            {/* INPUT */}
            <div className="border-2 border-[#2ecc8a] p-6 bg-[#0d1a15] text-[#f0f4f2] space-y-4">
              <h2 className="text-xl font-bold">Detect Emotion</h2>

              <textarea
                placeholder="How are you feeling today?"
                className="w-full p-3 bg-transparent border-2 border-[#2ecc8a] outline-none text-sm"
              />

              <div className="flex gap-3">
                <Button variant="primary">Analyze</Button>
                <Button variant="secondary">Upload Image</Button>
              </div>
            </div>

            {/* RESULT */}
            <div className="border-2 border-[#2ecc8a] p-6 bg-[#0d1a15] text-[#f0f4f2] space-y-4">
              <h2 className="text-xl font-bold">AI Therapy</h2>

              <p className="text-sm text-gray-300">
                Your detected emotion and therapy response will appear here.
              </p>

              <div className="text-[#2ecc8a] font-bold">
                Emotion: Calm
              </div>
            </div>

          </div>

          {/* MUSIC SECTION */}
          <div className="mt-12 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Music Recommendations
              </h2>

              <Button variant="secondary">
                Refresh
              </Button>
            </div>

            {error && (
              <div className="border-2 border-red-500 p-4 text-red-500 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 border-2 border-[#2ecc8a] animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recommendations.map((item, index) => (
                  <SongCard
                    key={index}
                    data={{
                      title: item.title,
                      artist: item.artist || 'Unknown',
                      mood: item.mood || 'Calm',
                      duration: item.duration || '3:00',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}