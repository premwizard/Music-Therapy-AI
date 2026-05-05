import FeatureCard from './FeatureCard'
import SongCard from './SongCard'
import { stats, playlists, features } from '../lib/mockData'

export default function Dashboard() {
  return (
    <section id="dashboard" className="space-y-6">
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-glow sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Music Therapy AI</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-100 sm:text-5xl">Tailored music with calming emotional guidance.</h1>
            <p className="text-slate-400">A modern therapy dashboard that updates recommendations and chat prompts based on your emotional state and session progress.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:w-auto lg:grid-cols-1">
            <div className="rounded-3xl bg-slate-950/90 p-5 text-slate-300 ring-1 ring-slate-800">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300/70">Next session</p>
              <p className="mt-4 text-2xl font-semibold text-slate-100">Mood reset</p>
              <p className="mt-2 text-sm text-slate-400">7:30 PM • 22 Feb</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-sky-500/10 p-5 text-slate-100 ring-1 ring-slate-800">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Session pace</p>
              <p className="mt-4 text-2xl font-semibold">Gentle</p>
              <p className="mt-2 text-sm text-slate-300">Soft rhythms and mindful transitions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-sm shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-sky-500/40">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-400">{item.label}</p>
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm font-semibold text-sky-300">{item.delta}</span>
            </div>
            <p className="mt-6 text-3xl font-semibold text-slate-100">{item.value}</p>
            <p className="mt-3 text-sm text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5 rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-glow sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Personalized playlists</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">Curated for your current mood</h2>
            </div>
            <button className="shrink-0 rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Refresh</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {playlists.map((item) => (
              <SongCard key={item.title} data={item} />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[32px] border border-slate-800 bg-slate-950/80 p-6 shadow-glow sm:p-8">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300/80">Session summary</p>
            <h2 className="text-2xl font-semibold text-slate-100">Today’s wellbeing focus</h2>
            <p className="text-sm leading-6 text-slate-400">Support your mental balance through soft rhythms, visual rest, and short guided listening sessions.</p>
          </div>
          <div className="space-y-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
