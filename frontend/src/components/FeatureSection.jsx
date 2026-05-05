import FeatureCard from './FeatureCard'
import Card from './Card'

export default function FeatureSection({ title, description, features }) {
  return (
    <Card className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.32em] text-sky-300">{title}</p>
        <p className="text-base leading-7 text-slate-400">{description}</p>
      </div>
      <div className="grid gap-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
        ))}
      </div>
    </Card>
  )
}
