export default function PageHeader({ eyebrow, title, description, badge }) {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-3 border-2 border-mint bg-forest-950 px-4 py-2 text-xs uppercase tracking-[0.32em] text-mint-400 font-archivo">
        {eyebrow}
        {badge ? <span className="border-2 border-mint bg-forest-950 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-mint-100 font-archivo">{badge}</span> : null}
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-forest-950 sm:text-5xl font-bebas">{title}</h1>
        <p className="text-base leading-7 text-forest-950/80 sm:text-lg font-archivo">{description}</p>
      </div>
    </div>
  )
}
