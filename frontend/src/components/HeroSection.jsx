import { Link } from 'react-router-dom'
import Button from './Button'

export default function HeroSection({ title, description, primaryAction, secondaryAction, badge }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border-2 border-mint bg-forest-950/90 p-8 shadow-mint-glow-strong backdrop-blur-xl lg:p-12 animate-fade-in">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(46,204,138,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(46,204,138,0.08),_transparent_40%)]" />
      <div className="relative space-y-10">
        <div className="inline-flex items-center gap-3 rounded-full border-2 border-mint bg-forest-900/90 px-4 py-2 text-xs uppercase tracking-[0.32em] text-mint-400 shadow-mint-glow font-archivo">
          <span className="h-2 w-2 rounded-full bg-mint-400 animate-pulse" />
          {badge}
        </div>
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl xl:text-7xl font-bebas leading-[1.1]">{title}</h1>
          <p className="text-lg leading-8 text-gray-300 sm:text-xl font-archivo">{description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to={primaryAction.href} className="inline-flex w-full justify-center">
            <Button variant="primary" size="lg" className="w-full">{primaryAction.label}</Button>
          </Link>
          <Link to={secondaryAction.href} className="inline-flex w-full">
            <Button variant="outline" size="lg" className="w-full">{secondaryAction.label}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
