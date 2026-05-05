import Card from './Card'

export default function SongCard({ data }) {
  return (
    <Card className="transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-mint-400 hover:bg-forest-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cream">{data.title}</p>
          <p className="mt-1 text-sm text-mint-100">{data.artist}</p>
        </div>
        <span className="border-2 border-mint px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-mint-400">{data.mood}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-mint-100">
        <span>{data.duration}</span>
        <button className="border-2 border-mint bg-mint-500 px-4 py-2 text-forest-950 transition duration-200 hover:bg-mint-400">
          Play
        </button>
      </div>
    </Card>
  )
}
