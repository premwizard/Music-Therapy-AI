import Card from './Card'

export default function BentoCard({ label, title, description }) {
  return (
    <Card className="overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-glow">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
        <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
        <p className="text-sm leading-6 text-slate-400">{description}</p>
      </div>
    </Card>
  )
}
