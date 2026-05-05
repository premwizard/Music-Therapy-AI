import Card from './Card'

export default function FeatureCard({ title, description }) {
  return (
    <Card className="border-2 border-mint bg-forest-950 p-5 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-mint-400">
      <div className="space-y-3">
        <p className="text-sm font-bold text-mint-300 uppercase tracking-[0.24em] font-archivo">{title}</p>
        <p className="text-sm leading-6 text-mint-100 font-archivo">{description}</p>
      </div>
    </Card>
  )
}
