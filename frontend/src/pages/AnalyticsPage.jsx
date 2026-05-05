import { useEffect, useState } from 'react'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { stats } from '../lib/mockData'
import { getMoodHistory } from '../services/api'

export default function AnalyticsPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function fetchHistory() {
      try {
        const data = await getMoodHistory(12)
        if (active) {
          setHistory(data.history || [])
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

    fetchHistory()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="w-full min-h-screen bg-cream text-forest-950 animate-fade-in">
      <main className="w-full flex justify-center py-8">
        <div className="w-full max-w-[1400px] px-6 md:px-12 lg:px-20">
          <div className="space-y-10">
            <PageHeader
              eyebrow="Analytics"
              title="Mood analytics that help you understand your inner tempo."
              description="Review trends and session signals from your therapy experience, then translate those insights into a more balanced listening plan."
            />

            <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
              <Card className="space-y-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-mint-400">Mood analytics</p>
                    <h2 className="mt-3 text-3xl font-bold text-cream">A visual map of emotional recovery and energy.</h2>
                  </div>
                  <div className="border-2 border-mint px-4 py-2 text-sm uppercase tracking-[0.28em] text-mint-100">Updated</div>
                </div>

                <Card className="border-2 border-mint bg-forest-950 p-6">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Weekly trend</p>
                      <p className="mt-2 text-lg font-semibold text-cream">Emotional resilience</p>
                    </div>
                    <span className="border-2 border-mint px-3 py-2 text-sm text-mint-100">+12% stability</span>
                  </div>

                  <div className="h-[320px] border-2 border-mint bg-forest-950 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="h-2 w-2 bg-mint-400" />
                      <span className="text-sm text-mint-100">Emotion score</span>
                    </div>
                    <div className="relative h-[240px] bg-forest-950 border-2 border-mint p-4">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-mint-500/10" />
                      <div className="absolute left-10 bottom-10 h-1.5 w-10 bg-cream" />
                      <div className="absolute right-10 top-10 h-1.5 w-14 bg-cream" />
                      <div className="absolute left-20 top-28 h-1.5 w-32 bg-cream" />
                    </div>
                  </div>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-2 border-mint bg-forest-950">
                    <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Focus</p>
                    <p className="mt-4 text-3xl font-bold text-cream">83%</p>
                    <p className="mt-2 text-sm text-mint-100">Session stability and concentration hold strong.</p>
                  </Card>
                  <Card className="border-2 border-mint bg-forest-950">
                    <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Recovery</p>
                    <p className="mt-4 text-3xl font-bold text-cream">4.2/5</p>
                    <p className="mt-2 text-sm text-mint-100">Steady progress across your recent playlists.</p>
                  </Card>
                </div>
              </Card>

              <div className="space-y-6">
                {stats.slice(0, 3).map((item) => (
                  <StatCard key={item.label} label={item.label} value={item.value} detail={item.description} />
                ))}

                <Card className="space-y-5 border-2 border-mint bg-forest-950">
                  <p className="text-sm uppercase tracking-[0.28em] text-mint-400">Mood history</p>
                  {loading ? (
                    <div className="border-2 border-mint bg-forest-950 p-5 text-sm text-mint-100">
                      <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="h-16 rounded-2xl bg-forest-900/60 animate-pulse" />
                        ))}
                      </div>
                    </div>
                  ) : error ? (
                    <div className="border-2 border-mint bg-[#4f1c1c] p-5 text-sm text-red-200">{error}</div>
                  ) : history.length === 0 ? (
                    <div className="border-2 border-mint bg-forest-950 p-5 text-sm text-mint-100">No mood history available yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <div key={item._id} className="border-2 border-mint bg-forest-950 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-cream">{item.emotion}</p>
                            <span className="border-2 border-mint px-3 py-1 text-xs uppercase tracking-[0.24em] text-mint-100">{item.source}</span>
                          </div>
                          <p className="mt-2 text-sm text-mint-100">{item.notes || 'No notes added.'}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-mint-100">{new Date(item.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
