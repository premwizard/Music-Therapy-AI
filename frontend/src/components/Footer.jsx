export default function Footer() {
  return (
    <footer className="mt-16 rounded-[24px] border border-slate-800 bg-slate-900/85 p-8 shadow-sm shadow-slate-950/10">
      <div className="flex flex-col gap-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Music Therapy AI sets a calm foundation for mood-aware listening and session recovery.</p>
        <div className="flex flex-wrap gap-3 text-slate-500">
          <button className="rounded-full border border-slate-800 bg-slate-950/90 px-4 py-2 transition hover:bg-slate-900">Privacy</button>
          <button className="rounded-full border border-slate-800 bg-slate-950/90 px-4 py-2 transition hover:bg-slate-900">Terms</button>
        </div>
      </div>
    </footer>
  )
}
