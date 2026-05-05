import Card from './Card'

const cards = [
  {
    title: 'Image Emotion Detection',
    icon: '📷',
    description: 'Analyze facial cues and emotional tone in real time to personalize every session.',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    title: 'Voice Emotion Detection',
    icon: '🎤',
    description: 'Interpret vocal mood signals to adapt playlists and therapy guidance instantly.',
  },
  {
    title: 'AI Therapist Chat',
    icon: '💬',
    description: 'Connect with a supportive AI that listens, reflects, and recommends soothing tracks.',
  },
  {
    title: 'Music Recommendation',
    icon: '🎵',
    description: 'Smart playlists combine emotion, tempo, and recovery to restore your balance.',
  },
  {
    title: 'Mood Analytics',
    icon: '📊',
    description: 'Visualize trends and emotional rhythms across every listening session.',
    span: 'lg:col-span-2',
  },
]

export default function BentoGrid() {
  return (
    <section className="grid gap-6 lg:grid-cols-4 lg:grid-rows-[260px_260px]">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className={`group relative overflow-hidden border-2 border-mint bg-forest-950/90 p-6 text-white shadow-mint-glow transition-all duration-300 hover:shadow-mint-glow-strong hover:scale-105 hover:border-mint-400 ${card.span ?? ''}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-mint-500/5 via-transparent to-mint-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex h-full flex-col justify-between gap-6">
            <div className="inline-flex items-center justify-center rounded-2xl bg-forest-900/90 border border-mint/30 px-4 py-3 text-2xl shadow-mint-glow backdrop-blur-xl transition-all duration-300 group-hover:bg-mint-500/20 group-hover:border-mint-400">
              {card.icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white font-bebas">{card.title}</h3>
              <p className="text-sm leading-6 text-gray-300 font-archivo">{card.description}</p>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-mint-400 font-archivo transition-colors duration-300 group-hover:text-mint-300">
              Learn more
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </div>
          </div>
        </Card>
      ))}
    </section>
  )
}
